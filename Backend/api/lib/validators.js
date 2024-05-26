import { body, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

export const registerValidator = () => [
  body("name", "Name should not be empty ").notEmpty(),
  body("username", "Username should not be empty ").notEmpty(),
  body("password", "Password should not be empty ").notEmpty(),
  body("bio", "Bio should not be empty ").notEmpty(),
];

export const validateHandler = (req, res, next) => {
  const errors = validationResult(req);
  const errorMessages = errors.array().map((error) => error.msg).join(",");
  console.log(errorMessages);

  if (errorMessages.isEmpty()) return next();
  else
  next(new ErrorHandler(errorMessages,400));
};
