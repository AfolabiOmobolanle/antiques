const { loadProducts } = require('../utils/files.js');

// Search products by query string
const searchProductsByQuery = (req, res) => {
  const { category, price, minPrice, maxPrice, tag } = req.query;
  let products = loadProducts();

  // Apply filters
  if (category) {
    products = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (price) {
    const parsedPrice = parseFloat(price);
    if (!isNaN(parsedPrice)) {
      products = products.filter((p) => {
        const baseBid = parseFloat(p.baseBid.replace('$', ''));
        return baseBid <= parsedPrice;
      });
    } else {
      return res.status(400).json({ error: "Invalid price value" });
    }
  }

  // Apply range filter if both minPrice and maxPrice are provided
  if (minPrice && maxPrice) {
    const parsedMinPrice = parseFloat(minPrice);
    const parsedMaxPrice = parseFloat(maxPrice);

    if (!isNaN(parsedMinPrice) && !isNaN(parsedMaxPrice)) {
      products = products.filter((p) => {
        const baseBid = parseFloat(p.baseBid.replace('$', ''));
        return baseBid >= parsedMinPrice && baseBid <= parsedMaxPrice;
      });
    } else {
      return res.status(400).json({ error: "Invalid price range values" });
    }
  }

  // Apply tag filter
  if (tag) {
    products = products.filter(
      (p) => p.tag && p.tag.toLowerCase() === tag.toLowerCase()
    );
  }

  res.status(200).send(products);
};



// Filter products by category or tag
const filterProducts = (req, res) => {
  const { category, tag } = req.query;
  const products = loadProducts();

  const results = products.filter((product) => {
    const matchesCategory = category ? product.category === category : true;
    const matchesTag = tag ? product.tag === tag : true;
    return matchesCategory && matchesTag;
  });

  res.json(results);
};



module.exports = {
  searchProductsByQuery,
  filterProducts,
};
