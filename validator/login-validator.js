const {z, INVALID}=require('zod');
const loginschema=z.object({
    email:z
    .string({required_error:"Name is required"})
    .trim()
    .email({message:"invalid email address"})
    .min(3,{message:"email at least of 3 chars"})
    .max(255,{message:"email must not be 255 characters."}),
    password:z
    .string({required_error:"password is required"})
    .min(6,{message:"password at least of 6 chars"})
    .max(1024,{message:"password must not be 1024 characters."})
});
module.exports=loginschema