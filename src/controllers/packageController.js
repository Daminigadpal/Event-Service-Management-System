const Package =required ("../models/package");
exports.createPackage= async(req,res)=>{
    try{
        const data= await Package.create(req.body);
        res.status(201).json(data);
    }catch(e){
        res.status(400).json({message:e.message});
    }
};
exports.getPackages=async(req,res)=>{
    res.json(await Package.find().populate("services"));
};

exports.getPackage=async (req,res)=>{
   const pkg =  await Package.findById(req.param.id).populate("services");
   if(!pkg)return res.status(404).json({message:"Not found"})
    res.json(pkg);
}

exports.updatePackage=async(req,res)=>{
    res.json(await package.findByIdAndUpdate(req.param.id, req.body,{new:true})

    );
}

exports.deletePackage= async(req,res)=>{
    await Package.findByIdAndDelete(req.param.id);
    res.json({message:"package delete"})
};




