import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [{ type: Number }],
    },
    userProfile: {
      about: {
        type: String,
      },
      photo: {
        type: String,
      },
      coverPhoto: {
        type: String,
      },
    },
    password: {
      type: String,
      required: false,
      minlength: 5,
    },
    businessName: {
      type: String,
      //required: false,
      trim: true,
    },
    firstName: {
      type: String,
      required: false,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    displayName: {
      type: String,
      required: false,
      trim: true,
    },
    providerId: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    profileImg: {
      type: String,
    },
    coverPhoto: {
      type: String,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

userSchema.statics.getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

export const User = mongoose.model('User', userSchema);
