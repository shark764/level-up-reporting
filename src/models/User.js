import mongoose, { Schema } from 'mongoose';

export const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
