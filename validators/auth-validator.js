const {z} = require("zod");

const registerSchema = z.object({
    name:z.
    string({required_error:"Name is required"})
    .trim()
    .min(3,"Name should be atleast 3 character in length")
    .max(255,"Maximum character allowed is 255"),

    email:z.
    string({required_error:"Email is required"})
    .trim()
    .email({message:"invalid email"})
    .min(3,"Email should be atleast 3 character in length")
    .max(255,"Maximum character allowed is 255"),

    mobile:z.
    string({required_error:"Mobile is required"})
    .trim()
    .min(10,"mobile number should be atleast 10 digits")
    .max(10,"Maximum character allowed is 10"),

    password:z.
    string({required_error:"Password is required"})
    .trim()
    .min(8,"password should be atleast 8 character in length")
    .max(100,"Maximum character allowed is 100")
})

module.exports = registerSchema;