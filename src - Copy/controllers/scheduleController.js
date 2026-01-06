const Schedule= require("../models/Schedule");

exports.assignSchedule = async (req ,res)=>{
    try{
        const schedule=await Schedule.create(req.body);
            res.status(201).json(schedule);
    }
    catch(e){
        res.status(400).json({message:e.message});
    }
};
exports.getSchedule = async (req,res)=>{
    res.json(await Schedule.find().populate("booking").populate("staff"));
};





// const Schedule = require("../models/Schedule");

// exports.assignSchedule = async (req, res) => {
//   try {
//     const schedule = await Schedule.create(req.body);
//     res.status(201).json(schedule);
//   } catch (e) {
//     res.status(400).json({ message: e.message });
//   }
// };

// exports.getSchedules = async (req, res) => {
//   res.json(await Schedule.find().populate("booking").populate("staff"));
// };
