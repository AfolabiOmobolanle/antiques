const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); 

// Express app setup
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Do not create session until something is stored
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Secure cookies for production
      maxAge: 1000 * 60 * 30, // Session expiration time (30 minutes)
    },
  })
);

// Serve static files (images, etc.)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Your API routes
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/visitor', require('./routes/visitors'));
app.use('/api/v1/products', require('./routes/products'));

// Server start
const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
