import jwt from "jsonwebtoken";

export const verifyToken =async (req,res,next) =>{
    try {
        let token = req.header("Authorization")
        if(!token) return res.status(403).json({message:"Authorization Denied"})

        if(token.startsWith("Bearer ")){
            token = token.split(" ")[1];
        }

        let verified = jwt.verify(token,process.env.JWT_SECRETE_KEY);
        req.user = verified
        next()
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}