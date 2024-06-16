import express, { RequestHandler } from 'express';
import requireAuth from '../../../middlewares/requireAuth';
import { asyncHandler } from '../../../utils/asyncHandler';
import sendSuccess from '../../../utils/sucessHandler';
import upload from '../../../middlewares/multer';
import { CustomError } from '../../../utils/errorhandler';
import { cloudinaryUpload } from '../../../utils/cloudinary';
const router = express.Router();

export const uploadFile: RequestHandler = asyncHandler(
  async (req, res, next) => {
    console.log(req.file);
    const localFilepath = req?.file?.path;
    if (!localFilepath) {
      return new CustomError('No file provided', 400);
    }

    const response = await cloudinaryUpload(localFilepath);
    if (!response) {
      return new CustomError('Error uploading file', 500);
    }
    sendSuccess(res, response, 200);
  }
);

router.post('/upload', requireAuth, upload.single('profileImage'), uploadFile);

export default router;
