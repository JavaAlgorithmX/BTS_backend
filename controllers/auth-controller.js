const User = require("../models/user-model");
const bcrypt = require("bcryptjs");


const register = async (req, res,next)=>{
    try{
        const {name, password, email , mobile} = req.body;

        const isEmailExist =await User.findOne({email:email});
        
        if(isEmailExist){
            return res.status(400).json({message:`Email: ${email} already exists in our system`});
        }

        const isMobileExist = await User.findOne({mobile});

        if(isMobileExist){
            return res.status(400).json({message:`Mobile: ${mobile} already exists in our system`});
        }

        const userCreated = await User.create({name, password, email , mobile});
        res.status(201).json({
            message:"registration successful",
            token:await userCreated.generateToken(),
             userId:userCreated._id.toString()});

    }catch(error){
        console.log(error);
        next(error);
    }
}

const login = async (req, res)=>{
    try{
        const { email, password} = req.body;

        const isUserExist =await User.findOne({email:email});
        
        if(!isUserExist){
            return res.status(400).json({message:`User Not found`});
        }
        //compare password
        const isValidPassword = await bcrypt.compare(password,isUserExist.password);
        if(isValidPassword){
            return res.status(200).json(
                {message:"Login successful",
                token: await isUserExist.generateToken(),
                userId:isUserExist._id.toString()
            }
                );
        }
        res.status(400).json({"message":"Password is incorrect"});

    }catch(error){
        console.log(error);
        next(error);
    }
}

const user = async (req, res)=>{
    try {
        const userData = req.user;
        console.log(userData);
        res.status(200).json({userData})
    } catch (error) {
        console.log(error);
    }
}

module.exports = { register, login, user }