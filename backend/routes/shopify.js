const express = require('express');
const { fetchShopifyOrders } = require('../controllers/shopifyController');
const router = express.Router();

// Shopify orders route
module.exports = (io) => {
  router.get('/orders', (req, res) => {
    // Pass the 'res' object to fetchShopifyOrders so that it can respond to the API call
    fetchShopifyOrders(res);
  });

  return router;
};

