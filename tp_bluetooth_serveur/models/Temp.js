const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/objetsconnectes')
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur connexion MongoDB :', err));


const tempSchema = new mongoose.Schema({
    temperature: Number,
    date: Date
});

module.exports = mongoose.model('Temp', tempSchema);