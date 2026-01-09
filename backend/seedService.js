import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "./src/models/Service.js";

dotenv.config();

const seedService = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if service exists
    const existingService = await Service.findOne({ name: "Wedding Planning" });
    
    if (existingService) {
      console.log('Service already exists');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create new service
    const service = await Service.create({
      name: "Wedding Planning",
      description: "Complete wedding planning and execution",
      price: 5000,
      duration: 8
    });

    console.log('Service created successfully:', service);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedService();