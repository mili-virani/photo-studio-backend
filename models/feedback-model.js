const {mongoose,Schema} = require('mongoose');

const feedbackSchema = new Schema({
    name:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: true,
        maxlength: 50, 
    },
    rating: {
        type: Number, 
        required: true,
        maxlength: 50, 
    }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
