import mongoose from 'mongoose';

const cartProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [cartProductSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const Cart = mongoose.model('carts', cartSchema);
