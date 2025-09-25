const Temp = require('../models/Temp')


exports.addTemp = async (req, res) => {
    try {
        temperature = req.query.temperature.replace('-', '.');
        if (temperature < -20 || temperature > 50) {
            return res.status(400).json({ error: 'Temperature out of range' });
        }
        const temp = new Temp({
            date: new Date(Date.now()),
            temperature: temperature
        });
        await temp.save();
        res.status(201).json(temp);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTemp = async (req, res) => {
    try {
        const temps = await Temp.find();
        res.json(temps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}