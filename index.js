import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import multer from "multer";

import userRoutes from "./Routes/userRoutes.js";
import authRoutes from "./Routes/authRoutes.js";

import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import fs from "fs";

import {
  S3Client,
} from "@aws-sdk/client-s3";

import ServiceProvider from "./Models/serviceProvider.js";
import { updatePicture } from "./Controllers/user.js";
import { verifyToken } from "./Middleware/auth.js";
import { serviceRegistration } from "./Controllers/Auth.js";
import { handleFeedback } from "./Controllers/feedback.js";

dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const secreteAccesskey = process.env.SECRETE_ACCESS_KEY;
const accessKeyId = process.env.ACCESS_KEY_ID;
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secreteAccesskey,
  },
  region: bucketRegion,
});

const app = express();
const swaggerYAML = fs.readFileSync("./swagger.yaml", "utf8"); // Read the YAML file
const swaggerDoc = YAML.parse(swaggerYAML);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(cors());

// routes
app.use("/auth",authRoutes);
app.use("/auth/serviceRegistration",upload.array('images'),serviceRegistration);
app.use("/user", userRoutes);
app.post("/feedback/:user_id",handleFeedback);

// Update profile picture Route
app.patch('/user/updatePicture/:user_id',upload.single('image'),updatePicture);


// app.get("/get", async (req, res) => {
//   try {
//     const getObjectParams = {
//       Bucket: bucketName,
//       Key: "carousel_4.jpg",
//     };

//     const command = new GetObjectCommand(getObjectParams);
//     const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
//     console.log(url);
//     res.send(200).json(url);
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.post("/post", upload.single("image"), async (req, res) => {
//   try {
//     console.log(req.file.originalname);
//     const params = {
//       Bucket: bucketName,
//       Key: req.file.originalname,
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype,
//     };
//     const command = new PutObjectCommand(params);
//     const resp = await s3.send(command);
//     res.status(200).send(resp);
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.post("/register", upload.single("image"), async (req, res) => {
//   try {
//     // here we are getting the attributes of a trade person from the request body
//     const { name, profession, experience, about, contact } = req.body;

//     const img = req.file.originalname;
//     const currentDateTime = new Date().toISOString().replace(/:/g, "-"); // Format as 'YYYY-MM-DDTHH-MM-SS'

//     // Create a unique file name by appending the timestamp
//     const uniqueFileName = `${img}_${currentDateTime}`;

//     const putParams = {
//       Bucket: bucketName,
//       Key: uniqueFileName,
//       Body: req.file.buffer,
//       ContentType: req.file.mimeType,
//     };

//     const putCommand = new PutObjectCommand(putParams);
//     await s3.send(putCommand);

//     let object = new ServiceProvider({
//       name,
//       profession,
//       experience,
//       contact,
//       about,
//       rating: 0,
//       profilePicture: uniqueFileName,
//       gallery: [],
//       saved: [],
//       notifications: [],
//     });
//     let resp = await object.save();

//     res.status(200).json(resp);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json(error);
//   }
// });


mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewURLParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(4000, () => {
  console.log("server running on port no: 4000");
});
