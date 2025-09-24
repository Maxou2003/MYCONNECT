const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/objetsconnectes');
mongoose.Promise = global.Promise
mongoose.connection.on('error', console.error.bind(console, 'Une erreur de connexion MongoDB est survenue :'))


const tempSchema = new mongoose.Schema({
    temperature: Number,
    date: Date
});

module.exports = mongoose.model('Temp',tempSchema);