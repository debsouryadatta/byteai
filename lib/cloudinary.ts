import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

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

export async function getPdfUrl(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: process.env.CLOUDINARY_FOLDER,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );
    
    Readable.from(buffer).pipe(stream);
  });
}