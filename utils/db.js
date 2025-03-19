const mongoose=require('mongoose');


URI=process.env.MONGODB_URL;

const connectDb = async () => {
    try {
        await mongoose.connect(URI);
        console.log("connection succesfully to db");
        
    } catch (error) {
        console.log(error); 
        console.log("connection failed");
        process.exit(0);
        
    }
}

module.exports=connectDb