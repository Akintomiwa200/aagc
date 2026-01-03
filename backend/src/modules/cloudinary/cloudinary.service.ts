import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: 'auto', // auto-detect image, video, raw
      };

      if (folder) {
        uploadOptions.folder = folder;
      }

      // Handle both buffer and path
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        },
      );

      if (file.buffer) {
        uploadStream.end(file.buffer);
      } else if (file.path) {
        // If file is on disk
        const fs = require('fs');
        fs.createReadStream(file.path).pipe(uploadStream);
      } else {
        reject(new Error('File buffer or path is required'));
      }
    });
  }

  async uploadFromUrl(url: string, folder?: string): Promise<UploadApiResponse> {
    const uploadOptions: any = {
      resource_type: 'auto',
    };

    if (folder) {
      uploadOptions.folder = folder;
    }

    return cloudinary.uploader.upload(url, uploadOptions);
  }

  async deleteFile(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }

  async deleteFiles(publicIds: string[]): Promise<any> {
    return cloudinary.api.delete_resources(publicIds);
  }
}

