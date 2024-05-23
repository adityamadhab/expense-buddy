const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const rootRouter = require('./routes/root');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and handle CORS
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/v1', rootRouter);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
