import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import authRoutes from "./Routes/Auth.js"
import bodyParser from 'body-parser'
import swaggerUi from "swagger-ui-express"
import YAML from "yaml"
import fs from "fs"
import serviceRoutes from "./Routes/service.js"

const app = express();
const swaggerYAML = fs.readFileSync('./swagger.yaml', 'utf8'); // Read the YAML file
  const swaggerDoc = YAML.parse(swaggerYAML);

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDoc))
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(cors());


// Auth routes
app.use('/auth',authRoutes);
app.use('/get',serviceRoutes);

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
