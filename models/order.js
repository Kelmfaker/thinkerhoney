const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const shippingAddressSchema = new Schema({
  city: { type: String, required: true },
  region: { type: String, required: true },
  details: { type: String, required: true }
});

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [itemSchema], required: true },
  totalAmount: { type: Number, required: true },
coupon: { type: Schema.Types.ObjectId, ref: 'Coupon', default: null }, // <<=== تم إضافة هذا السطر
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: { type: shippingAddressSchema, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;