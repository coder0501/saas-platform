const axios = require('axios');
let io; // Declare a global io variable to avoid circular dependency

// Fetch Shopify orders and optionally respond via HTTP
const fetchShopifyOrders = async (res = null) => {
  try {

    const response = await axios({
      method: 'get',
      url: process.env.SHOPIFY_STORE_URL,
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      params: {
        status: 'any',
        limit: 70,
      }
    });

    const orders = response.data.orders;
    const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);


    // For demonstration, let's assume you get the visitor data from somewhere
    const totalVisitors = 1000; // Placeholder, this should be fetched from your data source

    // Calculate conversion rate
    const conversionRate = (orders.length / totalVisitors) * 100;
    const totalLength = orders.length;

    // Emit data to all connected clients via Socket.IO
    io.emit('shopifyData', { orders, totalSales, conversionRate, totalLength });

    // If there's an HTTP response object, send data back to the client
    if (res) {
      return res.status(200).json({
        success: true,
        data: { orders, totalSales, conversionRate, totalLength }
      });
    }

  } catch (error) {
    console.error('Error fetching Shopify data:', error);
    // Handle both Socket.IO and API response error cases
    if (res) {
      return res.status(500).json({ success: false, message: 'Failed to fetch Shopify orders' });
    }
  }
};

// Set interval to fetch data every 5 minutes and emit it
const startShopifyDataEmission = (socketIO) => {
  io = socketIO; // Assign the passed io instance to the global variable

  // Emit data initially when the server starts
  fetchShopifyOrders();

  // Schedule to fetch data and emit every 5 minutes
  setInterval(() => {
    fetchShopifyOrders();
  }, 5 * 60 * 1000); // Fetch every 5 minutes
};

module.exports = { startShopifyDataEmission, fetchShopifyOrders };
