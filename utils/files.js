const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/products.json');

  const saveProducts = (products) => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
};
 const loadProducts = () => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

module.exports = {
    saveProducts,
  loadProducts,
};