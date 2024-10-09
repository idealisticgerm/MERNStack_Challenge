import mongoose from "mongoose";
import colors from "colors";

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected!".bgMagenta.white);
    }catch(err){
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}
export default connectDB;
