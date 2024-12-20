const express = require('express');
const router = express.Router();
const {
  searchProductsByQuery,
  filterProducts,
} = require('../controller/product.controller.js');

router.get('/search', searchProductsByQuery);


router.get('/filter', filterProducts);


module.exports = router;
