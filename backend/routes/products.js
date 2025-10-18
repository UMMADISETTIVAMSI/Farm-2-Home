const express = require('express');
const Product = require('../models/Product');
const { auth, farmerOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    let query = { quantity: { $gt: 0 } };
    
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .select('name category price quantity unit image farmName farmAddress farmPhone')
      .populate('farmer', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Product.countDocuments(query);
    
    res.json({ products, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, farmerOnly, async (req, res) => {
  try {
    const { name, category, price, quantity, unit, image, farmAddress, farmPhone } = req.body;
    
    if (!name?.trim() || !price || !quantity || !farmAddress?.trim() || !farmPhone?.trim()) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    if (price <= 0 || quantity <= 0) {
      return res.status(400).json({ message: 'Price and quantity must be positive numbers' });
    }
    
    const product = new Product({
      name: name.trim(), 
      category, 
      price: Number(price), 
      quantity: Number(quantity), 
      unit,
      image,
      farmer: req.user._id,
      farmName: req.user.farmName || req.user.name,
      farmAddress: farmAddress.trim(),
      farmPhone: farmPhone.trim()
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-products', auth, farmerOnly, async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, farmerOnly, async (req, res) => {
  try {
    const updates = { ...req.body };
    
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user._id },
      updates,
      { new: true }
    );
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, farmerOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, farmer: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/favorites', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      select: 'name category price quantity unit image farmName farmAddress farmPhone'
    });
    res.json(user.favorites || []);
  } catch (error) {
    console.error('Favorites error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    const productId = req.params.id;
    
    if (!user.favorites) {
      user.favorites = [];
    }
    
    const favoriteIndex = user.favorites.findIndex(id => id.toString() === productId);
    
    if (favoriteIndex > -1) {
      user.favorites.splice(favoriteIndex, 1);
    } else {
      user.favorites.push(productId);
    }
    
    await user.save();
    res.json({ message: 'Favorite toggled successfully' });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;