import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error in connecting to MongoDB:", error.message);
        process.exit(1); // ❗ stop server if DB fails
    }
};

export default connectToMongoDB;
