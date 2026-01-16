import { BadRequestException, Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import {
  RESOURCE_TYPE,
  UPLOAD_DIRECTORY,
} from 'src/constants/upload.constants';
import * as streamifier from 'streamifier';
import { UploadResult } from './upload.interface';
import { ERROR_MESSAGES } from 'src/constants/messages.constants';

@Injectable()
export class UploadsService {
  async uploadMultipleAttachments(files: Express.Multer.File[]): Promise<{
    data: UploadResult[];
  }> {
    if (!files || files.length === 0) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }

    const uploadPromises = files.map((file) => {
      return new Promise<UploadApiResponse | UploadApiErrorResponse>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: UPLOAD_DIRECTORY,
              resource_type: RESOURCE_TYPE as any,
            },
            (error, result) => {
              if (error) return reject(error);
              if (result) resolve(result);
            },
          );

          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        },
      );
    });

    const data = await Promise.all(uploadPromises);
    const result: UploadResult[] = data.map((image) => ({
      public_id: image.public_id,
      secure_url: image.secure_url,
    }));

    return {
      data: result,
    };
  }

  async deleteSingleAttachment(publicId: string) {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: RESOURCE_TYPE,
    });
  }

  async deleteMultipleAttachments(publicIds: string[]) {
    if (!publicIds || publicIds.length === 0) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }

    const deletePromises = publicIds.map((id) =>
      cloudinary.uploader.destroy(id, {
        resource_type: RESOURCE_TYPE,
      }),
    );

    await Promise.all(deletePromises);
  }
}
