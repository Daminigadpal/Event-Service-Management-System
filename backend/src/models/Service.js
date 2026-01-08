import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Photography, DJ, etc.
  description: String,
  price: Number,
  duration: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);

export default Service;
