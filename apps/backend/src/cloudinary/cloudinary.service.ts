import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { base64File } from 'src/common/helpers/base64File';
import { ICloudinaryUploadResponse } from 'src/common/types/types';
import { CreateImageDetails } from './types/types';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    options = {},
  ): Promise<CreateImageDetails> {
    try {
      const img = (await cloudinary.uploader.upload(
        base64File(file),
        options,
      )) as unknown as ICloudinaryUploadResponse;
      return { secure_url: img.secure_url, public_id: img.public_id };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
