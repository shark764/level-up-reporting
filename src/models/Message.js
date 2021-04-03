import mongoose, { Schema } from 'mongoose';

export const messageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    collection: 'messages',
    timestamps: true,
  }
);

export const Message = mongoose.model('Message', messageSchema);
