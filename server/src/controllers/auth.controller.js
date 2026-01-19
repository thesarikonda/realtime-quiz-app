import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Optional: Basic input validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if username OR email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({ error: "Username or email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    }); 

    // Save user, set cookie, respond
    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email
    });

  } catch (error) {
    console.error("Error in register controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


 export const login = async (req, res) => {
  try {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
    if(!user || !isPasswordCorrect){
      return res.status(400).json({error:"Invalid Email or Password"});
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      id:user._id,
      username:user.username,
      email:user.email
    })
    
  } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({error:"Internal server error"});
    
  }

}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message:"Logged out Successfully!"});

        
    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({error:"Internal server error"});
        
    }


}

