const express = require('express');
const router = express.Router();
const { saveUser,getTotalUsers } = require('../controller/users.controller.js');

// Route to save user data
router.post('/create', saveUser);
router.get('/total', (req, res) => {
  getTotalUsers((err, count) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ userCount: count });
  });
});


module.exports = router;
