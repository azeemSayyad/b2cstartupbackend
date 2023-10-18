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

export const serviceRegistration = async (req, res) => {
  try {
    // here we are getting the attributes of a trade person from the request body
    const { profession, experience, about, user_id, location } = req.body;

    const serviceProvider = await ServiceProvider.findOne({ user_id: user_id });
    const user = await User.findOne({ _id: user_id });
    if (serviceProvider) {
      return res.status(403).json({ message: "you have Already Registered" });
    }

    let object = new ServiceProvider({
      name: user.name,
      profession,
      experience,
      contact: user.contact,
      profilePicture: user.profilePicture,
      user_id,
      location,
      about,
      gallery: [],
    });
    let resp = await object.save();

    res.status(200).json(resp);
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
        .json({ message: "User Already Exist, please Log in to Continue" });
    }

    const img = req.file.originalname;
    const currentDateTime = new Date().toISOString().replace(/:/g, "-"); // Format as 'YYYY-MM-DDTHH-MM-SS'

    // Create a unique file name by appending the timestamp
    const uniqueFileName = `${img}_${currentDateTime}`;

    let object = new User({
      name,
      contact,
      password,
      profilePicture: uniqueFileName,
      saved: [],
      notifications: [],
    });
    let resp = await object.save();

    const putParams = {
      Bucket: bucketName,
      Key: uniqueFileName,
      Body: req.file.buffer,
      ContentType: req.file.mimeType,
    };

    const putCommand = new PutObjectCommand(putParams);
    await s3.send(putCommand);

    res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const login = async (req, res) => {
  try {
    const { contact, password } = req.body;

    const user = await User.findOne({ contact: contact });
    if (!user) {
      return res.status(403).json({ message: "User Not Exist" });
    }

    if (user.password !== password) {
      return res.status(403).json({ message: "Invalid Password" });
    }

    //to access profile picture stored in s3
    const getParams = {
      Bucket: bucketName,
      Key: user.profilePicture,
    };

    const getCommand = new GetObjectCommand(getParams);
    const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

    const token = jwt.sign({ id: contact }, process.env.JWT_SECRETE_KEY);

    console.log(url);
    res.status(200).json({ user, token, profilePictureURL: url });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { newPassword } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { $set: { password: newPassword } },
      { new: true }
    );
    res
      .status(200)
      .json({ message: " password reset successful", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(400).json(error)
  }
};
