const Order = require('../../models/order-model'); // Importing the Order model

// Create a new order (POST /orders)
const createOrder = async (req, res) => {
  try {
    const { user_id, products, billing_details, subtotal, shipping_fee, total, status } = req.body;

    // Basic validation
    if (!user_id || !products || !billing_details || !subtotal || !total) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create the order
    const newOrder = new Order({
      user_id,
      products,
      billing_details,
      subtotal,
      shipping_fee,
      total,
      status: status || 'Pending',
    });

    // Save order to database
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: savedOrder });
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};


// Get all orders (GET /orders)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user_id', 'name email')
      .populate('products.product_id', 'name price image');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single order by ID (GET /orders/:id)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user_id', 'name email')
      .populate('products.product_id', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an order by ID (PUT /orders/:id)
const updateOrder = async (req, res) => {
  try {
    const { products, billing_details, subtotal, shipping_fee, total, status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        products,
        billing_details,
        subtotal,
        shipping_fee,
        total,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Exporting functions
module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
};
