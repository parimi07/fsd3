// routes/purchase.js
const express = require('express');
const Purchase = require('../models/Purchase'); // Import Purchase model
const auth = require('../middleware/auth'); // Import auth middleware

const router = express.Router();

// Purchase Route
router.post('/purchase', auth, async (req, res) => {
    const { itemId, quantity } = req.body;

    try {
        const newPurchase = new Purchase({
            userId: req.userId, // Use authenticated user's ID
            itemId,
            quantity,
        });
        await newPurchase.save(); // Save purchase to database
        res.status(201).json({ message: 'Purchase successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing purchase' });
    }
});
