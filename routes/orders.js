const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { Product} = require('../models/product')
router.post('/', async (req, res) => {
  const { customerId, products } = req.body;
  try {
    let total = 0;
    for (const product of products) {
      const productData = await Product.findById(product.productId);
      if (!productData) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
      total += productData.price * product.quantity;
    }

    const newOrder = new Order({
      customerId,
      products,
      total,
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('customerId'); // Populate customer details
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('customerId'); // Populate customer details
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { products, total } = req.body; // Update logic goes here

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { products, total }, { new: true }); // Update and return new data
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;