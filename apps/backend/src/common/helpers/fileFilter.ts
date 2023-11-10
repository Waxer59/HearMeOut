import { ACCEPTED_IMG_EXTENSIONS } from '../constants/constants';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) {
    return cb(new Error('File is empty'), false);
  }

  const fileExtension = file.mimetype.split('/')[1];

  if (ACCEPTED_IMG_EXTENSIONS.includes(fileExtension)) {
    return cb(null, true);
  }

  cb(null, false);
};
