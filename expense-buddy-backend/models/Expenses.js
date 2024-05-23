const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [
            "Food",
            "Shopping", 
            "Fuel",
            "Entertainment",
            "Telephone",
            "Pets",
            "Holidays",
            "Recharge",
            "Kids",
            "Insurance",
            "Energy",
            "Rent",
            "Others",
        ],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Expense', expenseSchema);