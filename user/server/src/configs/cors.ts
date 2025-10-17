import cors, { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:5173",
    "https://www.saerv.com",
    "https://saerv.com",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  credentials: true, // Allow cookies and authorization headers
};

export default cors(corsOptions);
