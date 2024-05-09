const express = require('express');
const router = express.Router();
const Expense = require('../models/Expenses');
require('dotenv').config();
const mongoose = require('mongoose');

const authMiddleware = require('../middlewares/authMiddleware');

// @route   POST /expenses
// @desc    Add a new expense
// @access  Private
router.post('/add', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const { amount, description, category } = req.body;

        const newExpense = await Expense.create({
            amount,
            description,
            category,
            user: req.user
        });

        res.json({
            newExpense
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /expenses
// @desc    Get all expenses
// @access  Private
router.get('/all', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const expenses = await Expense.find({ user: req.user }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /expenses/total
// @desc    Get total expense of the user
// @access  Private
router.get('/total', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const expenses = await Expense.find({ user: req.user });

        // Check if expenses is an array
        if (!Array.isArray(expenses)) {
            return res.status(500).json({ error: 'Unable to fetch expenses' });
        }

        // Calculate total expense
        let totalExpense = 0;
        expenses.forEach(expense => {
            totalExpense += expense.amount;
        });

        res.json({ totalExpense });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/total-by-category', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const cataegories = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user)
                }
            },
            {
                $group: {
                    _id: "$category",
                    value: { $sum: "$amount" }
                }
            }
        ]);
        res.json(cataegories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET /expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /expenses/:id
// @desc    Delete expense by ID
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL);
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await expense.remove();

        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;