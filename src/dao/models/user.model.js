import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true, trim: true },
        last_name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        age: { type: Number, required: true, min: 0 },
        password: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
        previousPasswords: { type: [String], default: [] }
    },
    { timestamps: true }
);

export const userModel = mongoose.model(userCollection, userSchema);
