const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const authMiddleware = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');
require('dotenv').config();

// Add income route
router.post('/add', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const { amount, description, source } = req.body;

        if (!amount || !description || !source) {
            return res.status(400).json({ msg: 'Please provide amount, description, and source' });
        }

        const newIncome = await Income.create({
            amount,
            description,
            source,
            user: req.user
        });

        res.json({
            newIncome
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all incomes route
router.get('/all', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const incomes = await Income.find({ user: req.user }).sort({ date: -1 });
        res.json(incomes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/total', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const incomes = await Income.find({ user: req.user });

        // Check if expenses is an array
        if (!Array.isArray(incomes)) {
            return res.status(500).json({ error: 'Unable to fetch expenses' });
        }

        // Calculate total expense
        let totalIncome = 0;
        incomes.forEach(income => {
            totalIncome += income.amount;
        });

        res.json({ totalIncome });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/total-by-source', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const sources = await Income.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user)
                }
            },
            {
                $group: {
                    _id: "$source",
                    value: { $sum: "$amount" }
                }
            }
        ]);
        res.json(sources);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// Get income by ID route
router.get('/:id', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({ msg: 'Income not found' });
        }

        if (income.user.toString() !== req.user.toString()) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(income);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete income by ID route
router.delete('/:id', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({ msg: 'Income not found' });
        }

        if (income.user.toString() !== req.user.toString()) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Income.remove();

        res.json({ msg: 'Income removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
