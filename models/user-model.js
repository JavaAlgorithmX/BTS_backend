const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    mobile:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
})

//Hash the password before saving to db

userSchema.pre('save',async function(next){
    //  console.log(" before hashing ",this); //this will provide all data before saving
    const user = this;

    if(!user.isModified){
        next();
    }

    try {
        //Hash the password
     const saltRound = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(user.password,saltRound);
     user.password = hashedPassword;
        
    } catch (error) {
        next(error);
    }
    //  console.log(" after hashing ",this)
})

//JSON WEB TOKEN
userSchema.methods.generateToken = async  function () {
    console.log("inside generate token")
    console.log("secret key : ",process.env.JWT_SECRET_KEY )
    try {
        console.log("indise try block");
        return jwt.sign(
            {
                userId:this._id.toString(),
                email:this.email,
                isAdmin:this.isAdmin
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn:"30d",
            }
             
        )
    } catch (error) {
        console.error(error);
    }

}

//define the model or collection name
const User = new mongoose.model("User",userSchema);

module.exports = User;