import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookieOptions = {
  //The sameSite attribute in cookies is used to control whether a cookie can be sent along with cross-site requests, providing a measure of protection against cross-site request forgery (CSRF) attacks. The sameSite attribute can have three values: Strict, Lax, and None.
  httpOnly: true,
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  secure: true,
};

const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "ChatterBox" })
    .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
    .catch((err) => {
      throw err;
    });
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({
    _id:user._id
  },"process.env.JWT_SECRET");

  console.log(token);
   return res.status(code).cookie("access_token", token, cookieOptions).json({
     success: true,
     message,
   });
};



export { sendToken, connectDB,cookieOptions};
