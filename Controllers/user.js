import User from "../Models/User.js";
import ServiceProvider from "../Models/serviceProvider.js";

import dotenv from "dotenv";
dotenv.config();

import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

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

export const fetchAllServiceProviders = async (req, res) => {
  try {
    const persons = await TradePerson.find();
    res.status(200).json(persons);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const persons = await User.find();
    res.status(200).json(persons);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const fetchByService = async (req, res) => {
  try {
    const { service } = req.params;
    console.log("fetch.js 15:", service);
    const allServiceProviders = await ServiceProvider.find();

    let requiredServiceProviders = allServiceProviders.filter((person) =>
      person.profession.includes(service)
    );
    console.log(requiredServiceProviders);

    res.status(200).json(requiredServiceProviders);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const updatePicture = async (req, res) => {
  try {
    const { user_id } = req.params;
    const imageName = req.file.originalname;
    const currentDateTime = new Date().toISOString().replace(/:/g, "-");
    const uniqueFileName = `${imageName}_${currentDateTime}`;

    const user = await User.findOne({ _id: user_id });
    console.log(user);

    // Delete existing picture from s3
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: user.profilePicture,
    };
    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3.send(deleteCommand);

    // Put new image in S3
    const putParams = {
      Bucket: bucketName,
      Key: uniqueFileName,
      Body: req.file.buffer,
      ContentType: req.file.mimeType,
    };
    const putCommand = new PutObjectCommand(putParams);
    await s3.send(putCommand);

    // update the picture name in mongoDB
    const updatedUser = await User.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          profilePicture: uniqueFileName,
        },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Profile Picture Changed Successfully", updatedUser });
  } catch (error) {
    console.log(error, "user.js controller line 61");
    res.status(400).json(error);
  }
};

export const updateServiceProvider = async (req, res) => {
  try {
    // here we are getting the attributes of a service person from the request body
    const { name,profession, experience, about, location } = req.body;
    const {serviceProvider_id} = req.params;
    
    const object={
      name,
      profession,
      experience,
      about,
      location
    }
    const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(serviceProvider_id,{$set:object},{new:true})
    res.status(200).json({message:"Update Success", updatedServiceProvider});
    
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
