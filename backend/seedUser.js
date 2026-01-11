import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Import User model after connection
    const { default: User } = await import("./src/models/User.js");

    // Check if user exists
    const existingUser = await User.findOne({ email: "staff@gmail.com" });

    if (existingUser) {
      console.log('User already exists');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create new user
    const user = await User.create({
      name: "Staff Member",
      email: "staff@gmail.com",
      password: "staff123",
      role: "staff"
    });

    console.log('User created successfully:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedUser();