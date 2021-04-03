import mongoose, { Schema } from 'mongoose';

export const hitSchema = new Schema(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    deviceId: {
      type: String,
      trim: true,
    },
    value1: {
      type: Number,
    },
    value2: {
      type: Number,
    },
    value3: {
      type: Number,
    },
    value4: {
      type: Number,
    },
  },
  {
    collection: 'hits',
    timestamps: true,
  }
);

export const Hit = mongoose.model('Hit', hitSchema);
