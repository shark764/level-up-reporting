import mongoose, { Schema } from 'mongoose';

export const hitSchema = new Schema(
  {
    // Unique identifier for the device.
    deviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    gameId: {
      type: Schema.Types.ObjectId,
      ref: 'games',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    // hit sequence number (0 = start, 1-98 = hits, 99 = timeout, 100 = errant hit)
    hitSequence: {
      type: Number,
    },
    // time in milliseconds
    hitTime: {
      type: Number,
    },
    // range from 80 - 1024. 0 if hit sequence is 0, 99, or 100
    hitPower: {
      type: Number,
    },
    // 0 if hit sequence is 0, 99, or 100.
    hitDirection: {
      type: Number,
    },
    // 0 if hit sequence is 0, 99, or 100.
    hitDistance: {
      type: Number,
    },
  },
  {
    collection: 'hits',
    timestamps: true,
  }
);

export const Hit = mongoose.model('Hit', hitSchema);
