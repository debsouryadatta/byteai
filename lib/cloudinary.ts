import { v2 as cloudinary } from "cloudinary";

// Configure cloudinary for image uploads
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getPhotoUrl(dataUrl: string) {
  try {
    const photoUrl = await cloudinary.uploader.upload(dataUrl, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      folder: process.env.CLOUDINARY_FOLDER,
    });

    return photoUrl.secure_url;
  } catch (error) {
    console.log(error);
    throw error;
  }
}