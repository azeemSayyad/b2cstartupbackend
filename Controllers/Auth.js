import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import ServiceProvider from "../Models/serviceProvider.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import User from "../Models/User.js";
import sharp from "sharp";
import { Upload } from "@aws-sdk/lib-storage";

const secreteAccesskey = process.env.SECRETE_ACCESS_KEY;
const accessKeyId = process.env.ACCESS_KEY_ID;
const bucketRegion = process.env.BUCKET_REGION;
const bucketName = process.env.BUCKET_NAME;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secreteAccesskey,
  },
  region: bucketRegion,
});

const uploadToS3 = async (files) => {
  const uploadedImagePaths = [];
  const uploadPromises = files.map(async (file) => {
    const imageName = file.originalname;

    const imageBuffer = await sharp(file.buffer)
      .jpeg({ quality: 80 })
      .withMetadata()
      .toBuffer();

    const currentDateTime = new Date().toISOString().replace(/:/g, "-");
    const uniqueFileName = `${imageName}_${currentDateTime}`;
    uploadedImagePaths.push(uniqueFileName);

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: bucketName,
        Key: uniqueFileName,
        Body: imageBuffer,
      },
    });

    return upload.done();
  });

  try {
    const uploadResponses = await Promise.all(uploadPromises);
    console.log(uploadedImagePaths);
    return uploadedImagePaths;
  } catch (error) {
    console.error("Error uploading images to S3:", error);
    throw error;
  }
};

export const serviceRegistration = async (req, res) => {
  try {
    // here we are getting the attributes of a trade person from the request body
    const { profession, experience, about, user_id, location } = req.body;
    const professionArray = JSON.parse(profession);

    // const serviceProvider = await ServiceProvider.findOne({ user_id: user_id });
    const user = await User.findOne({ _id: user_id });
    // console.log(user,user_id);
    // if (serviceProvider) {
    //   return res.status(403).json({ message: "you have Already Registered" });
    // }
    const professionList = professionArray.map((str) => str.toLowerCase());

    const uploadedImagePaths = await uploadToS3(req.files);

    let object = new ServiceProvider({
      name: user.name,
      profession: professionList,
      experience,
      contact: user.contact,
      profilePicture: user.profilePicture,
      user_id,
      location,
      about,
      gallery: uploadedImagePaths,
    });
    await object.save();

    
    const userServiceList = await ServiceProvider.find({ user_id: user_id });
    console.log(userServiceList)

    res.status(200).json(userServiceList);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
export const userRegistration = async (req, res) => {
  try {
    // here we are getting the attributes of a user from the request body
    const { name, contact, password } = req.body;

    const user = await User.findOne({ contact: contact });

    if (user) {
      return res
        .status(403)
        .json({ message: "User Already Exist, please Sign in to Continue" });
    }

    let object = new User({
      name,
      contact,
      password,
      profilePicture: null,
      saved: [],
      notifications: [],
    });
    let resp = await object.save();

    res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const login = async (req, res) => {
  try {
    const { contact, password } = req.body;
    console.log();

    const user = await User.findOne({ contact: contact });
    console.log(user);
    if (!user) {
      return res.status(403).json({ message: "User Not Exist" });
    }

    if (user.password !== password) {
      return res.status(403).json({ message: "Invalid Password" });
    }

    const user_id = user._id;

    const userServiceList = await ServiceProvider.find({ user_id: user_id });

    const token = jwt.sign({ id: contact }, process.env.JWT_SECRETE_KEY);

    res.status(200).json({ user, token, userServiceList });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { contact } = req.params;
    const { newPassword } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { contact: contact },
      { $set: { password: newPassword } },
      { new: true }
    );
    res
      .status(200)
      .json({ message: " password reset successful", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
