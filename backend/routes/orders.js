const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.quantity < quantity) return res.status(400).json({ message: 'Insufficient quantity' });
    
    const order = new Order({
      client: req.user._id,
      farmer: product.farmer,
      product: productId,
      quantity,
      totalPrice: product.price * quantity
    });
    
    await order.save();
    await Product.findByIdAndUpdate(productId, { $inc: { quantity: -quantity } });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ client: req.user._id })
      .populate('product', 'name category')
      .populate('farmer', 'name farmName phone');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/farmer-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id })
      .populate('product', 'name category')
      .populate('client', 'name phone');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user._id },
      { status },
      { new: true }
    );
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, client: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'pending') return res.status(400).json({ message: 'Cannot cancel confirmed orders' });
    
    await Product.findByIdAndUpdate(order.product, { $inc: { quantity: order.quantity } });
    order.status = 'cancelled';
    await order.save();
    
    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/earnings', auth, async (req, res) => {
  try {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const totalEarnings = await Order.aggregate([
      { $match: { farmer: req.user._id, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    const monthlyEarnings = await Order.aggregate([
      { $match: { farmer: req.user._id, status: 'delivered', createdAt: { $gte: currentMonth } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    const pendingEarnings = await Order.aggregate([
      { $match: { farmer: req.user._id, status: { $in: ['pending', 'confirmed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    res.json({
      total: totalEarnings[0]?.total || 0,
      monthly: monthlyEarnings[0]?.total || 0,
      pending: pendingEarnings[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;