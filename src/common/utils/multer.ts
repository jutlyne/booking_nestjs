import { diskStorage } from 'multer';
import { extname } from 'path';

export const uploadConfig = {
  destination: './uploads',
  maxSize: 5 * 1024 * 1024,
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(new Error('Only image files are allowed'), false);
    }
    callback(null, true);
  },
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExt = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
    },
  }),
};
