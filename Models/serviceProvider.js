import mongoose from "mongoose";

const ServiceProviderSchema = mongoose.Schema(
    {
        name:{
            required:true,
            type:String,
            min:3,
            max:20
        },
        profession:{
            required:true,
            type:[],
        },
        experience:{
            required:true,
            type:String,
        },
        profilePicture: String,
        contact:String,
        user_id:String,
        about:String,
        gallery:[],
        location: String,
        notifications:[]
    }
)

const ServiceProvider = mongoose.model("ServiceProvider",ServiceProviderSchema)
export default ServiceProvider