import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const PRESCRIPTIONS_DIR = path.resolve('uploads/prescriptions');
if (!fs.existsSync(PRESCRIPTIONS_DIR)) {
  fs.mkdirSync(PRESCRIPTIONS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PRESCRIPTIONS_DIR);
  },
  filename: (req, file, cb) => {
    const randomHash = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `rx_${Date.now()}_${randomHash}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('INVALID_FILE_TYPE: Only JPG, PNG, WEBP, and PDF documents are allowed.'), false);
  }
};

export const uploadPrescriptionFile = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter
}).single('prescription');
