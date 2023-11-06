import mongoose from 'mongoose';

const schema = mongoose.Schema({
    user_id:String,
    feedback:String
})

const Feedback = mongoose.model("feedback",schema);
export default Feedback;