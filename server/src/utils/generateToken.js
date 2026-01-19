import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {   
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'5d',
    })

    res.cookie( "jwt", token,{
        maxAge : 15 * 24 * 60 * 60 * 1000,
        httpOnly : true, // prevent XSS
        secure:true,
        sameSite : "None", //  
        
    });

}

export default generateTokenAndSetCookie;