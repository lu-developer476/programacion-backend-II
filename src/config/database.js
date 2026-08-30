import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDatabase = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongoUrl);
  console.log('✅ MongoDB conectado');
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};
