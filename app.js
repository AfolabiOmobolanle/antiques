const express = require('express');
const session = require('express-session');
const connectRedis = require('connect-redis');
const redis = require('redis');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

// Redis Client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL, // or use your redis connection URL directly
});

// Express app setup
const app = express();
const RedisStore = connectRedis(session); // connectRedis is now directly used with session

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new RedisStore({ client: redisClient }), // Use RedisStore with session
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 30 },
  })
);

// Serve static files (images, etc.)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Your API routes
app.use('/api/v1/user', require('./routes/users'));
app.use('/api/v1/visitor', require('./routes/visitors'));
app.use('/api/v1/products', require('./routes/products'));

// Server start
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
