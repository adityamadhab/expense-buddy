const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    amount: { 
        type: Number,
        required: true 
    },
    description: {
        type: String,
        required: true
    },
    source: {
        type: String,
        enum: [
            "Salary", 
            "Shares",
            "Family-Allowance",
            "Refunds",
            "Sales",
            "Gifts",
            "Properties-Rent",
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
        ref: "User", 
        required: true 
    }
});

module.exports = mongoose.model('Income', incomeSchema);