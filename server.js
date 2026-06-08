const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Connection Error:", err));

const User = mongoose.model('User', new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 }
}));

app.get('/api/balance/:number', async (req, res) => {
    const user = await User.findOne({ number: req.params.number });
    res.json(user ? user : { number: req.params.number, balance: 0 });
});

app.post('/api/update-balance', async (req, res) => {
    const { number, amount } = req.body;
    const user = await User.findOneAndUpdate(
        { number },
        { $inc: { balance: amount } },
        { new: true, upsert: true }
    );
    res.json(user);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
