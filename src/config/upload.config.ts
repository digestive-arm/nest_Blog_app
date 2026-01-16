import { v2 as cloudinary } from 'cloudinary';
import { getOsEnv } from './env.config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';
import {
  MAX_UPLOAD_COUNT,
  UPLOAD_FILE_SIZE,
} from 'src/constants/upload.constants';

const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: getOsEnv('CLOUD_NAME'),
      api_key: getOsEnv('CLOUD_API_KEY'),
      api_secret: getOsEnv('CLOUD_API_SECRET'),
    });
  },
};

export const uploadOptions: MulterOptions = {
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
      cb(new BadRequestException('Only image files are allowed'), false);
    }

    cb(null, true);
  },
  limits: { fieldSize: UPLOAD_FILE_SIZE, files: MAX_UPLOAD_COUNT },
};

export default CloudinaryProvider;
