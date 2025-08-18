/*
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
            cb(null, dir)
        } else {
            cb(null, dir)
        }
    },
    filename: (req, file, cb) => {
        const fileName = path.basename(file.originalname, path.extname(file.originalname));
        const extension = path.extname(file.originalname);
        cb(null, fileName + "_" + Date.now() + extension)
    }
});

const imageFilter = (req, file, cb) => {
    const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg|jfif|heic|avif|JPG|JPEG|PNG|GIF|WEBP|BMP|TIFF|SVG|JFIF|HEIC|AVIF)$/;
    if (!allowedExtensions.test(file.originalname)) {
        return cb(new Error("Only image files are allowed (jpg, jpeg, png, gif, webp, bmp, tiff, svg, jfif, heic, avif)."), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    }
});

export { upload };

*/

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "uploads",
        allowed_formats: [
            "jpg", "JPG",
            "jpeg", "JPEG",
            "png", "PNG",
            "gif", "GIF",
            "webp", "WEBP",
            "bmp", "BMP",
            "tiff", "TIFF",
            "svg", "SVG",
            "jfif", "JFIF",
            "heic", "HEIC",
            "avif", "AVIF"
        ],
        public_id: (req, file) => file.originalname.split(".")[0] + "_" + Date.now()
    }
});

const imageFilter = (req, file, cb) => {
    const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg|jfif|heic|avif)$/i;
    if (!allowedExtensions.test(file.originalname)) {
        return cb(
            new Error(
                "Only image files are allowed (jpg, jpeg, png, gif, webp, bmp, tiff, svg, jfif, heic, avif)."
            ),
            false
        );
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export { upload };
