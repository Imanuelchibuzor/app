import multer from "multer";

// Use memoryStorage so files are available as buffers on `req.file.buffer`
const storage = multer.memoryStorage();

// 10 MB limit
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

export default upload;
