import ImageKit from "imagekit";
import AppError from "../configs/error";

const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } =
  process.env;

if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
  throw new AppError(
    "Missing ImageKit environment variables. Ensure IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT are set.",
    500,
    { isOperational: false, code: "MISSING_IMAGEKIT_ENV" }
  );
}

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
}) as InstanceType<typeof ImageKit>;

export default imagekit;
