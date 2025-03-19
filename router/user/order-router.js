const express = require('express');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
} = require('../../controller/user/order-controller');

const router = express.Router();

router.post('/', createOrder); // Create an order
router.get('/', getAllOrders); // Get all orders
router.get('/:id', getOrderById); // Get a single order by ID
router.put('/:id', updateOrder); // Update an order

module.exports = router;
