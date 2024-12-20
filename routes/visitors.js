// routes/visitorRoutes.js
const express = require('express');
const router = express.Router();
const {
handleHomePage
} = require('../controller/visitor.controller.js');



router.get('/visit', handleHomePage);




module.exports = router;
