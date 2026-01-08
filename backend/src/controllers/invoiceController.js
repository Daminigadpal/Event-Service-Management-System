const invoice = require("../models/Invoice");
exports.createInvoice=async(req,res)=>{
    try{
        const inv=  await Invoice.create(req.body);
        res.status(201).json(inv);
    }catch(e){
        res.status(400).json({message:e.message});
    }
}
exports.getInvoices= async (req,res)=>{
    res.json(await Invoice.find().populate("booking"));
}



