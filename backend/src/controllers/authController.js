import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id)=>{
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
}

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res) => {
  const {firstname, lastname, email, password, role} = req.body;
  const userExists = await User.findOne({email});
  if(userExists) return res.status(400).json({success:false,message:"User already exists"});

  const user = await User.create({firstname,lastname,email,password,role});
  const token = generateToken(user._id);

  res.status(201).json({success:true,user,token});
}

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user) return res.status(401).json({success:false,message:"Invalid credentials"});

  const isMatch = await user.matchPassword(password);
  if(!isMatch) return res.status(401).json({success:false,message:"Invalid credentials"});

  const token = generateToken(user._id);
  res.json({success:true,user,token});
}

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json({
    success: true,
    data: user
  });
}

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
export const updateDetails = async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
}
