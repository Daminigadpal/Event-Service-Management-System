const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id)=>{
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
}

exports.registerUser = async (req,res)=>{
  const {firstname, lastname, email, password, role} = req.body;
  const userExists = await User.findOne({email});
  if(userExists) return res.status(400).json({success:false,message:"User already exists"});

  const user = await User.create({firstname,lastname,email,password,role});
  const token = generateToken(user._id);

  res.status(201).json({success:true,user,token});
}

exports.loginUser = async (req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user) return res.status(401).json({success:false,message:"Invalid credentials"});

  const isMatch = await user.matchPassword(password);
  if(!isMatch) return res.status(401).json({success:false,message:"Invalid credentials"});

  const token = generateToken(user._id);
  res.json({success:true,user,token});
}
