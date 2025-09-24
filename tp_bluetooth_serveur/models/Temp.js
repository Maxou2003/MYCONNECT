const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/objetsconnectes')
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur connexion MongoDB :', err));
mongoose.Promise = global.Promise
mongoose.connection.on('error', console.error.bind(console, 'Une erreur de connexion MongoDB est survenue :'))


const tempSchema = new mongoose.Schema({
    temperature: Number,
    date: Date
});

module.exports = mongoose.model('Temp', tempSchema);