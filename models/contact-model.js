const  {Schema,model, default: mongoose}=require('mongoose');

const contactschema=new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobileno:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    }
});

const contact=new model('contact',contactschema)

module.exports=contact;