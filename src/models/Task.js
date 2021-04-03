import mongoose, { Schema } from 'mongoose';

export const taskSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    task: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    collection: 'tasks',
    timestamps: true,
  }
);

export const Task = mongoose.model('Task', taskSchema);
