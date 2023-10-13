import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import authRoutes from "./Routes/Auth.js"
import { register, test } from "./Controllers/Auth.js";
import bodyParser from 'body-parser'

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(cors());


// Auth routes
app.use('/auth',authRoutes);

mongoose
  .connect(
    "mongodb+srv://b2cStartup:B2seeStartup007@cluster0.nr4h4ga.mongodb.net/",
    {
      useUnifiedTopology: true,
      useNewURLParser: true,
    }
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(4000, () => {
  console.log("server running on port no: 4000");
});
