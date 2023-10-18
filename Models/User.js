import mongoose from "mongoose";

const schema = mongoose.Schema({
    name:{
        required:true,
        type:String,
        min:3,
        max:20
    },
    contact:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        required:true
    }
})

const User = mongoose.model("User",schema);

export default User;