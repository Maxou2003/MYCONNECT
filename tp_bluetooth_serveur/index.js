const express = require('express');
const path = require('path');
const tempController = require('./controllers/tempController');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:8000','http://127.0.0.1:8000', 'http://192.168.1.51:3000']
}));


app.use(express.static(path.join(__dirname, 'public')));

const API_KEY = process.env.API_KEY;

app.get('/api',(req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    console.log()
    return res.status(401).send('Unauthorized');
  }
  next();
});

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


app.get('/api/addtemperature' ,tempController.addTemp);

app.get('/gettemperatures', tempController.getTemp);


app.listen(8000, function () {

  console.log('Le serveur écoute sur son port 8000');

});