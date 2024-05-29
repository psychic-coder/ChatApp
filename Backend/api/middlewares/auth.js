import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import { adminSecretKey } from "../app.js";
import { ACCESS_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";

export const isAuthenticated = TryCatch((req, res, next) => {
  //in the below line we're getting hold of the accesstoken which is name access_token
  const token = req.cookies[ACCESS_TOKEN];
  if (!token)
    return next(new ErrorHandler("Please login to access this route", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  //in the decoded data we receive _id and iat
  //and now we can access the user data using the req.user, as it contains the userId
  req.user = decodedData._id;

  next();
});

export const adminOnly = (req, res, next) => {
  const token = req.cookies["access_token_admin"];

  if (!token)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  const secretKey = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  next();
};


///as we have used cookie parser so we can access the token
export const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);

    const authToken = socket.request.cookies[ACCESS_TOKEN];

    if (!authToken)
      return next(new ErrorHandler("Please login to access this route", 401));

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);

    if (!user)
      return next(new ErrorHandler("Please login to access this route", 401));

    socket.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};