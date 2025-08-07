const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  price: {
    type: Number,
    required: true
  },
  promoPrice: Number,
  stock: Number,
  inStock: {
    type: Boolean,
    default: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;