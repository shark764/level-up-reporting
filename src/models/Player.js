import mongoose, { Schema } from 'mongoose';

export const playerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    collection: 'players',
    timestamps: true,
  }
);

export const Player = mongoose.model('Player', playerSchema);
