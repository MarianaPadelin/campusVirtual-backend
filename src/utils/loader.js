import multer from 'multer'; 


const storage = multer.diskStorage({
    // 2 parámetros: dónde se guarda y qué nombre le pone al archivo guardado

    destination: function(req, file, callback){
        //el callback es la función Next, los parámetros son: el error y la carpeta donde guardo el archivo
        console.log(file)
        callback(null, "../backend/src/public")
    },

    filename: function(req, file, callback) {
        console.log(file)
        callback(null, file.originalname)
    }
})

export const loader = multer({ storage })