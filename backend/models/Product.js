const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Others'], 
    required: true 
  },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  image: { type: String },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmName: { type: String, required: true },
  farmAddress: { type: String, required: true },
  farmPhone: { type: String, required: true }
}, { timestamps: true });

// Indexes for better query performance
productSchema.index({ name: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ farmer: 1 });
productSchema.index({ quantity: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);