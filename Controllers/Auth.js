import tradePerson from "../Models/tradePerson.js";

export const test = (req,res)=>{
    try{
        console.log(req.body);
        const {name } = req.body;
        console.log(name);
    }
    catch(err){
        console.log(err);
        res.send(err).status(400);
    }
}

export const register = async(req,res)=>{
    try {
        // here we are getting the attributes of a trade person from the request body
        const {name,profession,experience,about,contact} = req.body;
        
        let object =new tradePerson({
            name,
            profession,
            experience,
            contact,
            about,
            rating:0,
            gallery:[],
            saved:[],
            notifications:[]
        });
        let resp = await object.save();
        
        res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

export const login = async(req,res)=>{
    try {
        const {email, password} = req.body;
    } catch (error) {
        res.status(400).json(error);
    }
}