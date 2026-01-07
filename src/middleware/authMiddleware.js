const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function authMiddleware(req, res, next) {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader||!authHeader.startWith("Bearer")){
            return res.status(401).json({message:"No token provided"})
        }
        const token= authHeader.split("Bearer")[1];
        //verify token
        const decoded =jwt.verify(token,process.env.Jwt_SECRET);
        //find User
        const user= await User.findById(decoded.id).select("-password");
        if(!user){
      return res.status(401).json({message:"User not found"})
         req.user=user;
}
next();

    }catch(err)
    {
console.error(err);
return res.status(401).json({message:"User not found"});
    }
};





