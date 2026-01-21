const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "staff", "admin", "event_manager"],
      default: "user",
    },
    department: {
      type: String,
      default: "General",
    },
    skills: {
      type: [String],
      default: [],
    },
    services: {
      type: [String],
      default: [],
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function () {
  console.log('🔐 Pre-save hook triggered for user:', this.email);
  if (!this.isModified("password")) {
    console.log('🔐 Password not modified, skipping hash');
    return;
  }

  console.log('🔐 Hashing password...');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log('🔐 Password hashed successfully');
});

// MATCH PASSWORD
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// SIGN JWT TOKEN
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = mongoose.model("User", userSchema);
