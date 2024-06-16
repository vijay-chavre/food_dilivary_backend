import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { CustomError } from './errorhandler';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});

export const cloudinaryUpload = async (
  localFilepath: string
): Promise<UploadApiResponse | null> => {
  if (!localFilepath) {
    throw new CustomError('No file provided', 400);
  }
  try {
    const result = await cloudinary.uploader.upload(localFilepath, {
      resource_type: 'auto',
    });

    console.log('Response file uploaded to cloudinary', result);
    if (result) {
      fs.unlinkSync(localFilepath);
    }
    return result;
  } catch (err) {
    fs.unlinkSync(localFilepath);
    return null;
  }
};
