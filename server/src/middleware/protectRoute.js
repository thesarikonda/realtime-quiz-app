import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized user - Invalid Token"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized use - Invalid Token"});
        }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(400).json({message:"User not found."});
        }
        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
        
    }
    
}

export default protectRoute;