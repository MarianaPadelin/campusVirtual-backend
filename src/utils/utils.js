// import path from "path";
// import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import passport from "passport";

//Firma del jwt
export const PRIVATE_KEY = "CampusFirma";

//genero el token
export const generateJWToken = (user) => {
  //params: info a cifrar, firma, ttl
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "2h" });
};

//authToken

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Token presente: ", authHeader);

  if (!authHeader) {
    console.log("I get here"); //it takes me here
    return res
      .status(401)
      .json({ message: "No tiene acceso, credenciales incorrectas" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) {
      return res.status(403).json({ messasge: "sin autorización" });
    }
    req.user = credentials.user;
    console.log(req.user);
    next();
  });
};

// //Directorio
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

//Generamos la contraseña encriptada
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//Validamos la contraseña encriptada, comparando con la contraseña del usuario
export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    console.log("Strategy: ", strategy);

    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).send("No existe el usuario");
    if (req.user.role !== role) {
      return res.status(403).send("El usuario no tiene permisos");
    }
    next();
  };
};
// export default __dirname;
