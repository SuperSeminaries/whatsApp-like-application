import mongoose from "mongoose";
import Jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
  },
  status: {
    type: String,
    default: "Hey there! I'm using WhatsApp.",
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  profilePicUrl: {
    type: String,
    default: "default_profile_pic.png",
  },
  about: {
    type: String,
    default: "",
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  blockedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  blockedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  settings: {
    notificationSound: {
      type: String,
      default: "default_sound.mp3",
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
  },
  accountCreatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLoggedIn: {
    type: Date,
    default: Date.now,
  },
  referenceToken: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
});


userSchema.methods.generateAccessToken = async function () {
  return Jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });
};

userSchema.methods.generateReferenceToken = async function () {
  return Jwt.sign({ _id: this._id }, process.env.REFERENCE_TOKEN_SECRET, {
    expiresIn: process.env.REFERENCE_TOKEN_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
