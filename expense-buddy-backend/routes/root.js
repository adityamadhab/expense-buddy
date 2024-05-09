const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const expenseRouter = require('./expense');
const incomeRouter = require('./income');
const historyRouter = require('./history');
const balanceRouter = require('./balance');

router.use('/user', userRouter);
router.use('/expense', expenseRouter);
router.use('/income', incomeRouter);
router.use('/history', historyRouter);
router.use('/balance', balanceRouter);

module.exports = router;