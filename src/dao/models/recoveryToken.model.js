import mongoose from 'mongoose';

const tokenCollection = 'recovery_tokens';

const tokenSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 3600
    }
});

export const recoveryTokenModel = mongoose.model(tokenCollection, tokenSchema);