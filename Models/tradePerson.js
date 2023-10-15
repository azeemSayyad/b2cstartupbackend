import mongoose from "mongoose";

const tradePersonSchema = mongoose.Schema(
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
        contact:{
            type:String,
            unique:true
        },
        rating:Number,
        about:String,
        gallery:[],
        saved:[],
        notifications:[]
    }
)

const TradePerson = mongoose.model("tradeperson",tradePersonSchema)
export default TradePerson