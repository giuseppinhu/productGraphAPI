const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, default: 0 },
  companie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Companie",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  avatar_url: {
    type: String,
    default:
      "https://res.cloudinary.com/dhn5ceymi/image/upload/v1768948550/avatars/avatar_admin.png",
  },
});

module.exports = userSchema;
