const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const authMiddleware = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');
require('dotenv').config();

// Add income route
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { amount, description, source } = req.body;

    if (!amount || !description || !source) {
      return res.status(400).json({ msg: 'Please provide amount, description, and source' });
    }

    const newIncome = await Income.create({
      amount,
      description,
      source,
      user: req.user,
    });

    res.json({ newIncome });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all incomes route
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user }).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get total income route
router.get('/total', authMiddleware, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user });

    if (!Array.isArray(incomes)) {
      return res.status(500).json({ error: 'Unable to fetch incomes' });
    }

    const totalIncome = incomes.reduce((total, income) => total + income.amount, 0);

    res.json({ totalIncome });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get total income by source route
router.get('/total-by-source', authMiddleware, async (req, res) => {
  try {
    const sources = await Income.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user),
        },
      },
      {
        $group: {
          _id: "$source",
          value: { $sum: "$amount" },
        },
      },
    ]);
    res.json(sources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get income by ID route
router.get('/:id', authMiddleware, async (req, res) => {
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
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ msg: 'Income not found' });
    }

    if (income.user.toString() !== req.user.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await income.remove();

    res.json({ msg: 'Income removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Edit income by ID route
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { amount, description, source } = req.body;

    let income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ msg: 'Income not found' });
    }

    if (income.user.toString() !== req.user.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    income.amount = amount || income.amount;
    income.description = description || income.description;
    income.source = source || income.source;

    await income.save();

    res.json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
