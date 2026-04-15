const dotenv = require('dotenv');
dotenv.config();


const cloudinaryPkg = require('cloudinary');
const multerStorageCloudinaryPkg = require('multer-storage-cloudinary');
const CloudinaryStorage = multerStorageCloudinaryPkg.CloudinaryStorage || multerStorageCloudinaryPkg.default || multerStorageCloudinaryPkg;
const multer = require('multer');

const cloudinary = cloudinaryPkg.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
   cloudinary: cloudinaryPkg,
  params: {
    folder: 'jewelry_shop',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
  },
});

const upload = multer({ storage });
module.exports = { upload, cloudinary };

 