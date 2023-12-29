const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const authMiddleware = async (req, res, next)=>{
    const authorizationHeader = req.header('Authorization')
    const token = authorizationHeader.replace("Bearer ","").trim();

    if(!token){
        res.status(401).json({message:"Unauthorize"})
    }

    try {
        const isVerified = jwt.verify(token,process.env.JWT_SECRET_KEY);

        const userData = await User.findOne({email:isVerified.email}).select({
            password:0,
        })
        req.user = userData;
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports = authMiddleware;