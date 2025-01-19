// import path from "path"; 
// import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

// //Directorio
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


//Generamos la contraseña encriptada
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))


//Validamos la contraseña encriptada, comparando con la contraseña del usuario
export const isValidPassword = (user, password) => {
    console.log(user.password, password)
    return bcrypt.compareSync(password, user.password)
}


// export default utils;
// export default __dirname;