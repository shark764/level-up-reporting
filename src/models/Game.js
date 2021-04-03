import mongoose, { Schema } from 'mongoose';

export const gameSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
  },
  {
    collection: 'games',
    timestamps: true,
  }
);

export const Game = mongoose.model('Game', gameSchema);
