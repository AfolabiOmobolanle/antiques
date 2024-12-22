const express = require('express');
const router = express.Router();
const { saveUser,getTotalUsers } = require('../controller/users.controller.js');

// Route to save user data
router.post('/create', saveUser);
router.get('/total', getTotalUsers)

module.exports = router;
