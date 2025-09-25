var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
var adresse_du_module_bluetooth_de_notre_groupe = "98:D3:31:F6:1D:45";
var channel = 1;
var buffer_command = "";
const http = require('http')
const express = require('express')
const app = express()
const path = require("path")
var light_on = false;


app.use(express.static(path.join(__dirname,'public')))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Autorise toutes les origines
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // gérer la requête OPTIONS (pré-vol CORS)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // réponse vide pour la requête pré-vol
  }

  next();
});

// On déclare le code a exécuter lorsque l'évènement "data" sera émis :
btSerial.on('data', function (buffer) {
    var donnees_recues = buffer.toString('utf-8')
    console.log("donnees recues : " + donnees_recues)
    if (donnees_recues.indexOf('!') == -1){
        buffer_command = buffer_command + donnees_recues
    }else{
        var array_buffer = donnees_recues.split("!")
        buffer_command = buffer_command + array_buffer[0] + "!"
        console.log("Command : " + buffer_command)
        send_command_to_html(buffer_command)
        buffer_command = array_buffer[1]
        console.log("New command : " + buffer_command)
    }
})

function send_command_to_html(command){
        command_type = command.charAt(1)
        console.log("Commande type :" + command_type)
        if (["1","2","3","5"].includes(command_type)){
                if (command.charAt(2) == "1"){
                        light_on = true;
                }else{
                        light_on = false;
                }
        }else if (command_type == "4") {
        console.log(command.slice(2).replace("!","").replace(".","-"))
        http.get("http://192.168.1.1:8000/temperature?temperature="+command.slice(2).replace("!","").replace(".","-"))
        }
}


function send_data(data) {
    if (btSerial.isOpen() === true) {
        // A partir d'ici, nous sommes connecté au module Bluetooth HC-05 de notre Arduino, nous pouvons lui envoyer des messages
        var message_a_envoyer = data
        console.log(message_a_envoyer)
        var buffer_a_envoyer = new Buffer(message_a_envoyer, 'utf-8')
        btSerial.write(buffer_a_envoyer, function (err, bytesWritten) {
                if (err) {
                        console.log("une erreur s'est produite");
                } else {
                        console.log("le message a bien été émis en Bluetooth");
                }
        })
    }else {
        btSerial.connect(adresse_du_module_bluetooth_de_notre_groupe, channel, function () {
                console.log("connexion réussie au périphérique Bluetooth")
                send_data(data)
        })
    }
}


// On déclare le code a exécuter lorsque l'évènement "closed" sera émis, comme ça on pourra voir dans la console si jamais la connexion est fermée
btSerial.on('closed', function () {
  console.log("la connexion Bluetooth a été fermée.")
})

// On déclare le code a exécuter lorsque l'évènement "failure" sera émis, comme ça on pourra voir dans la console si il y a des problèmes
btSerial.on('failure', function(err) {
  console.log("une erreur Bluetooth est survenue, voici les informations sur l'erreur : " + err)
})

app.get('/', function (req,res) {
        res.send("Salut")
})

app.get('/led/state',function (req,res) {
        res.send({state:light_on});
})

app.get('/led',function (req,res) {
        console.log(req.query)
        if (req.query.state == "switch"){
                send_data("3")
        }else if (req.query.state == "on"){
                if ("time" in req.query){
                        send_data("6"+req.query.time)
                }else{send_data("1")}
        }else if (req.query.state == "off"){
                if ("time" in req.query){
                        send_data("7"+req.query.time)
                }else{send_data("2")}
        }else if (req.query.state == "blink") {
                send_data("5")
        }
        res.send("OK")
})

app.get('/temperature',function (req,res) {
        console.log("température")
        send_data("4")
        res.send("ok")
})


app.listen(3000, function () {
        console.log("La Raspberry écoute sur le port 3000")
        send_data("awake")
})
