import multer from 'multer'; 
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
//cambio diskStorage to memoryStorage


// const storage = multer.memoryStorage({
//     // 2 parámetros: dónde se guarda y qué nombre le pone al archivo guardado
//     destination: function(req, file, callback){
//         //el callback es la función Next, los parámetros son: el error y la carpeta donde guardo el archivo
//         console.log("log del middleware, archivo: ", file)
//         callback(null, "../backend/src/public")
//     },

//     filename: function(req, file, callback) {
//         callback(null, file.originalname)
//     }
// })
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pdf_uploads", // Change folder name if needed
    format: async (req, file) => "pdf", // Force PDF format
    public_id: (req, file) => file.originalname.split(".")[0], // Use filename as public ID
  },
});


export const loader = multer({ storage })