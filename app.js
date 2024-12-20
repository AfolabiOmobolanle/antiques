const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 7000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  session({
    secret: 'antique-secret-key',
    resave: false,
    saveUninitialized: true,
     cookie: {
      maxAge: 30 * 60 * 1000, // Session lasts for 30 minutes (in milliseconds)
    },
  })
);


// app.use('/images', express.static(path.join(__dirname, './public/images')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
console.log(path.join(__dirname, 'public/images'));

// Routes
app.use('/api/v1/user', require('./routes/users'));
app.use('/api/v1/visitor', require('./routes/visitors'));
app.use('/api/v1/products', require('./routes/products'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
