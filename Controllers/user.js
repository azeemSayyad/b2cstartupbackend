import User from "../Models/User.js";
import ServiceProvider from "../Models/serviceProvider.js";
import sharp from "sharp";

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
    const persons = await ServiceProvider.find();
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
    console.log(service);

    const allServiceProviders = await ServiceProvider.find();

    let requiredServiceProviders = allServiceProviders.filter((person) =>
      person.profession.includes(service)
    );

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
    if (user.profilePicture) {
      const deleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: user.profilePicture,
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await s3.send(deleteCommand);
    }

    const imageBuffer = await sharp(req.file.buffer)
      .resize({ width: 400, height: 400 })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Put new image in S3
    const putParams = {
      Bucket: bucketName,
      Key: uniqueFileName,
      Body: imageBuffer,
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

    const serviceList = await ServiceProvider.find({user_id:user_id});
    for(let service of serviceList){
      service.profilePicture = uniqueFileName;
      await service.save();
    }
    res
      .status(200)
      .json({
        message: "Profile Picture Changed Successfully",
        updatedUser,
        imagePath: uniqueFileName,
      });
  } catch (error) {
    console.log(error, "user.js controller line 61");
    res.status(400).json(error);
  }
};

export const updateServiceProvider = async (req, res) => {
  try {
    // here we are getting the attributes of a service person from the request body
    const { profession, experience, about, location } = req.body;
    const { serviceProvider_id } = req.params;

    const object = {
      profession,
      experience,
      about,
      location,
    };
    const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(
      serviceProvider_id,
      { $set: object },
      { new: true }
    );
    res.status(200).json({ message: "Update Success", updatedServiceProvider });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const updateName = async (req, res) => {
  try {
    const { updatedName } = req.body;
    const { user_id } = req.params;
    console.log(updatedName);

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { $set: { name: updatedName } },
      { new: true }
    );
    console.log(updatedUser, "user.js 145");
    res.status(200).json({ updatedUser, message: "Name updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const deleteService = async (req, res) => {
  try {
    const { service_id } = req.params;
    const { user_id } = req.body;
    console.log(req.body,user_id);
    const user = await ServiceProvider.findById(service_id);
    let imagePaths = user.gallery;
    // console.log(user, "<-- user");
    // res.status(200).json({message:"Everything is ok"});

    if (imagePaths) {
      for (let imagePath of imagePaths) {
        const deleteParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: imagePath,
        };
        const deleteCommand = new DeleteObjectCommand(deleteParams);
        const resp = await s3.send(deleteCommand);
      }
    }

    await ServiceProvider.findByIdAndDelete(service_id);

    const userServiceList = await ServiceProvider.find({ user_id: user_id });
    console.log(userServiceList,"done")
    res.status(200).json(userServiceList);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const addToSave = async(req,res)=>{
  try {
    const {user_id} = req.params;
    const service = req.body;
    // console.log(req.body)

    const user = await User.findById(user_id);
    user.saved.push(service);
    const updatedUser = await user.save();

    res.status(200).json({updatedUser})
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}
export const removeFromSave = async(req,res)=>{
  try {
    const {user_id} = req.params;
    const {service_id} = req.body;
    console.log(service_id);
    // return
    
    const user = await User.findById(user_id);
    user.saved = user.saved.filter((service) => service._id !== service_id);
    const updatedUser = await user.save();
    
    console.log("Removed From Saved List ")
    res.status(200).json({updatedUser})
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}

