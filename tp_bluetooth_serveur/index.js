const express = require('express');
const path = require('path');
const tempController = require('./controllers/tempController');

const app = express();


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {

  console.log('quelqu\'un a appelé le lien "/",');

  res.sendFile(path.join(__dirname, 'views', 'index.html'));

});

app.get('/ampoule', function (req, res) {

  console.log('quelqu\'un a appelé le lien "/ampoule",');

  res.sendFile(path.join(__dirname, 'views', 'index.html'));

});

app.get('/temperatures', function (req, res) {

  console.log('quelqu\'un a appelé le lien "/temperatures",');

  res.sendFile(path.join(__dirname, 'views', 'temperatures.html'));

});

app.get('/localisation', function (req, res) {

  console.log('quelqu\'un a appelé le lien "/localisation",');

  res.sendFile(path.join(__dirname, 'views', 'localisation.html'));

});


app.get('/addtemperature', tempController.addTemp);

app.get('/gettemperatures', tempController.getTemp);


app.listen(8000, function () {

  console.log('Le serveur écoute sur son port 8000');

});