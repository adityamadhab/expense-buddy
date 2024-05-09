const express = require('express');
const router = express.Router();
const Expense = require('../models/Expenses');
const Income = require('../models/Income');
const authMiddleware = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');
require('dotenv').config();

// Get balance route
router.get('/', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const userId = req.user;

        const income = await Income.find({ user: userId });
        const expenses = await Expense.find({ user: userId });

        const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

        const balance = totalIncome - totalExpenses;

        res.json({ balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
