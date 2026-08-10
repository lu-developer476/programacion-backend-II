import mongoose from 'mongoose';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    category: { type: String, required: true }
});

export const productModel = mongoose.model(productCollection, productSchema);