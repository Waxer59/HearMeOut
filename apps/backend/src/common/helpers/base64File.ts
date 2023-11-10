export const base64File = (file: Express.Multer.File): string => {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};
