import mongoose from "mongoose";

const ServiceProviderSchema = mongoose.Schema(
    {
        name:String,
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
    }
)

const ServiceProvider = mongoose.model("ServiceProvider",ServiceProviderSchema)
export default ServiceProvider