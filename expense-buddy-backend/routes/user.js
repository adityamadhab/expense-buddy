const express = require('express');
const router = express.Router();
const zod = require('zod');
require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

const saltRounds = 10;

const registerValidation = zod.object({
    fullname: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(7)
});

const loginValidation = zod.object({
    email: zod.string().email(),
    password: zod.string().min(7)
});


router.post('/register', async (req, res) => {
    try {
        const validationResult = registerValidation.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                msg: "Email/Password Invalid."
            });
        }

        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({
                msg: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user = await User.create({
            fullname: req.body.fullname,
            email: req.body.email,
            password: hashedPassword
        });

        return res.status(201).json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const validationResult = loginValidation.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                msg: "Incorrect credentials"
            });
        }

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({
                msg: "Incorrect credentials"
            });
        }

        const matchPassword = await bcrypt.compare(req.body.password, user.password);

        if (!matchPassword) {
            return res.status(400).json({
                msg: "Incorrect credentials"
            });
        }

        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET);

        return res.json({ token, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
