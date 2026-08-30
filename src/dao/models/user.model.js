import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    password: {
      type: String,
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'carts',
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'organizer', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true },
);

export const User = mongoose.model('users', userSchema);
