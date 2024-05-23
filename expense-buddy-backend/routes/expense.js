const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Expense = require('../models/Expenses');
const authMiddleware = require('../middlewares/authMiddleware');
require('dotenv').config();

router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const newExpense = await Expense.create({
      amount,
      description,
      category,
      user: req.user,
    });
    res.json({ newExpense });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/all', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/total', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user });
    if (!Array.isArray(expenses)) {
      return res.status(500).json({ error: 'Unable to fetch expenses' });
    }
    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    res.json({ totalExpense });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/total-by-category', authMiddleware, async (req, res) => {
  try {
    const categories = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user) } },
      { $group: { _id: "$category", value: { $sum: "$amount" } } },
    ]);
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/split/:id', authMiddleware, async (req, res) => {
  try {
    const { numPeople } = req.body;
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    if (expense.user.toString() !== req.user.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const splitAmount = expense.amount / numPeople;
    expense.amount = splitAmount;
    expense.description += ` (Splitted, original: ${expense.amount})`;
    await expense.save();
    res.json({
      msg: `Expense split successfully. Each person pays ${splitAmount.toFixed(2)}.`,
      updatedExpense: expense,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
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

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    if (expense.user.toString() !== req.user.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Expense.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    if (expense.user.toString() !== req.user.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    expense.amount = amount || expense.amount;
    expense.description = description || expense.description;
    expense.category = category || expense.category;
    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
