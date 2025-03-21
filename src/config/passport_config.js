// import passport from "passport";
// import { userModel } from "../../models/user.model.js";
// import { PRIVATE_KEY } from "../utils/utils.js";
// import jwtStrategy from "passport-jwt";

// const JwtStrategy = jwtStrategy.Strategy;
// const ExtractJWT = jwtStrategy.ExtractJwt;

// const inicializePassport = () => {
//   passport.use(
//     "jwt",
//     new JwtStrategy(
//       {
//         jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
//         secretOrKey: PRIVATE_KEY,
//       },
//       async (jwt_payload, done) => {
//         console.log("Entrando a passport strategy con jwt")
//         try {
//             console.log("payload: ", jwt_payload)
//             return done(null, jwt_payload.user)
//         } catch (error) {
//           return done(error);
//         }
//       }
//     )
//   );
// };

// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     let user = await userModel.findById(id);
//     done(null, user);
//   } catch (error) {
//     console.error("Error de deserialización", error);
//   }
// });

// const cookieExtractor = (req) => {
//     let token = null;

//     console.log("Entrando a cookie extractor");
//     if (req && req.cookies){
//         // console.log("Cookies presentes: " + req.cookies);
//         token = req.cookies["jwtCookieToken"];
//         console.log("Token obtenido de la cookie: ", token)
//     }
//     return token
// };

// export default inicializePassport;
