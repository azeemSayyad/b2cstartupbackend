import Feedback from "../Models/Feedback.js"

export const handleFeedback = async(req,res)=>{
    try {
      const {user_id} = req.params;
      const {feedback} = req.body;

      const object = new Feedback({
        user_id,
        feedback
      })
      await object.save();
      res.status(200).json({message:"Feedback received Successfully"})
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }