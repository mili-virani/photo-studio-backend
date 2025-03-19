const { Schema } = require("zod");

const validate=(Schema)=>async(req,res,next)=>{
    try {
        const parsebody=await Schema.parseAsync(req.body);
        req.body=parsebody;
        next();
    } catch (err) {
        const status=422;
        const message="fill out the field properly";
        const extradetails=err.errors[0].message;
        const error={
            status,
            message,
            extradetails,
        };
        console.log(error);
        
        next(error);
        // res.status(400).json({msg:mess
        // age});
    }
}

module.exports=validate;