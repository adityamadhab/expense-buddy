const express = require('express');
const router = express.Router();
const Expense = require('../models/Expenses');
const Income = require('../models/Income');
const authMiddleware = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');
require('dotenv').config();

// Get all expenses and incomes route
router.get('/', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const expenses = await Expense.find({ user: req.user }).sort({ date: -1 });
        const incomes = await Income.find({ user: req.user }).sort({ date: -1 });

        const expensesWithTypes = expenses.map(expense => ({ ...expense.toObject(), type: 'Expense' }));
        const incomesWithTypes = incomes.map(income => ({ ...income.toObject(), type: 'Income' }));

        let history = [...expensesWithTypes, ...incomesWithTypes];

        if (history.length > 0) {
            history.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        res.json({ allHistory: history });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
