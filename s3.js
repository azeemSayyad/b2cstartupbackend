import { S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'
dotenv.config();

export const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRETE_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});
