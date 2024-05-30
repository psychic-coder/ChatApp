import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";

//The sameSite attribute in cookies is used to control whether a cookie can be sent along with cross-site requests, providing a measure of protection against cross-site request forgery (CSRF) attacks. The sameSite attribute can have three values: Strict, Lax, and None.
const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  httpOnly: true,
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
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  );

  console.log(token);
  return res.status(code).cookie("access_token", token, cookieOptions).json({
    success: true,
    message,
  });
};

export const emitEvent = (req, event, users, data) => {
  const io=req.app.get("io");
  const usersSocket=getSockets(users)
  io.to(usersSocket).emit(event,data);
};

export const deleteFilesFromCloudinary = async (public_ids) => {};

export const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          /*public_id: uuid()
Purpose: Assigns a unique identifier to the uploaded file.
Explanation: The public_id option sets the public identifier for the uploaded resource. By default, Cloudinary generates a unique identifier for each upload, but you can specify your own identifier using this option*/
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });
  try {
    const results = await Promise.all(uploadPromises);
    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResults;
  } catch (error) {
    throw new Error("Error uploading files to cloudinary ", error);
  }
};

export { sendToken, connectDB, cookieOptions };
