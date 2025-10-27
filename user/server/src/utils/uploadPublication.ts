import imagekit from "../configs/imageKit";
import AppError from "../configs/error";

type ImageKitUploadOptions = {
  file: Buffer | string;
  fileName: string;
  folder?: string;
  isPrivateFile?: boolean;
};

export type ImageKitUploadResponse = any;

export default function uploadPublicationFile(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<ImageKitUploadResponse> {
  // derive extension from mimeType, fallback to 'bin'
  const ext = mimeType.split("/")[1] ?? "bin";
  const uniqueName = `${fileName}_${Date.now()}.${ext}`;

  const uploadOptions: ImageKitUploadOptions = {
    file: fileBuffer,
    fileName: uniqueName,
    folder: "/e-books/",
    isPrivateFile: true,
  };

  try {
    const result = imagekit.upload(uploadOptions);
    return result;
  } catch (err) {
    throw new AppError("Failed to upload file", 500, { isOperational: false });
  }
}
