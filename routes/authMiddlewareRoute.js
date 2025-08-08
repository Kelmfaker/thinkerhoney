const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

//Route to memberboard
router.get('/client', authMiddleware(['client']), (req, res) => {
    res.json({ message: `Welcome to the clientboard, ${req.user.name}!` });
});

//route to neederboard
router.get('/admin', authMiddleware(['admin']), (req, res) => {
    res.json({ message: `Welcome to the adminboard, ${req.user.name}!` });
});

router.all("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});

module.exports = router;