import express from "express";

const app = express();

app.get('/',(req,res)=>{
    res.send("Done")
})

app.listen(4000,()=>{console.log("server running on port no: 4000")})