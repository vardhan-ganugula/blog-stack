import {Schema, model} from 'mongoose'; 

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
        select: false,
    },
    email : {
        type : String,
        required : true,
        unique: true,
    },
    role : {
        type : String,
        enum : ['admin', 'user', 'pro'],
        default : 'user',
    },
    verified : {
        type : Boolean,
        default : false,
    },
    verificationToken : {
        type : String,
        default : null,
        select: false,
    },
    resetPasswordToken : {
        type : String,
        default : null,
        select: false,
    },
    resetPasswordExpires : {
        type : Date,
        default : null,
        select: false,
    },
    profilePicture : {
        type : String,
        default : 'https://res.cloudinary.com/djwnxly09/image/upload/v1745937656/logo_xvstkq.png',
    },
    verificationTokenExpires : {
        type : Date,
        default : null,
        select: false,
    },
}, {timestamps : true}); 

const userModel = model('User', userSchema);
export default userModel;