import mongoose from "mongoose";

const schema = mongoose.Schema({
    name:{
        type:String,
        min:3,
        required:true,
    },
    gmail:{
        type:String,
        required:true
    }
})

const User = mongoose.model("User",schema);

export default User;