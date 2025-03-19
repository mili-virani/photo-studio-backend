const {z, INVALID}=require('zod');

// creating object schema

const signupschema=z.object({
    username:z
    .string({required_error:"Name is required"})
    .trim()
    .min(3,{message:"name at least of 3 chars"})
    .max(255,{message:"name must not be 255 characters."}),
    email:z
    .string({required_error:"Name is required"})
    .trim()
    .email({message:"invalid email address"})
    .min(3,{message:"email at least of 3 chars"})
    .max(255,{message:"email must not be 255 characters."}),
    phone:z
    .string({required_error:"phone is required"})
    .trim()
    .min(10,{message:"phone at least of 10 chars"})
    .max(20,{message:"phone must not be 20 characters."}),
    password:z
    .string({required_error:"password is required"})
    .min(6,{message:"password at least of 6 chars"})
    .max(1024,{message:"password must not be 1024 characters."})
})

module.exports=signupschema;