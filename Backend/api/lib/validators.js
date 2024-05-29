import { body, validationResult, param, } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

/*body: Explicitly validates fields within the request body.
check: More flexible and can validate fields in the request body, query parameters, route parameters, headers, and cookies.*/


export const registerValidator = () => [
  body("name", "Name should not be empty ").notEmpty(),
  body("username", "Username should not be empty ").notEmpty(),
  body("password", "Password should not be empty ").notEmpty(),
  body("bio", "Bio should not be empty ").notEmpty(),
];
export const loginValidator = () => [
  body("username", "Username should not be empty ").notEmpty(),
  body("password", "Password should not be empty ").notEmpty(),
];
export const newGroupValidator = () => [
  body("name", "Please enter name ").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please select members ")
    .isArray({ min: 3, max: 100 })
    .withMessage("Members must be 3 between 100"),
];
export const addMemberValidator = () => [
  body("chatId", "Please enter Chat Id").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please enter members ")
    .isArray({ min: 1, max: 97 })
    .withMessage("Members must be 1-97"),
];
export const removeMemberValidator = () => [
  body("chatId", "Please enter Chat Id").notEmpty(),
  body("userId", "Please enter User Id").notEmpty(),
];
export const leaveGroupValidator = () => [
  param("id", "Please enter Chat Id").notEmpty(),
];
export const sendAttachmentsValidator = () => [
  body("chatId", "Please enter Chat Id ").notEmpty(),
];

export const getMessagesValidator = () => [
  param("id", "Please enter Chat Id").notEmpty(),
];

export const chatIdValidator = () => [
  param("id", "Please enter Chat Id").notEmpty(),
];

export const renameValidator = () => [
  param("id", "Please enter Chat Id").notEmpty(),
  body("name", "Please enter name ").notEmpty(),
];

export const sendRequestValidator = () => [
  body("userId", "Please enter userId ").notEmpty(),
];

export const acceptRequestValidator = () => [
  body("requestId", "Please enter requestId ").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Please Add Accept ")
    .isBoolean()
    .withMessage("Accept must be boolean "),
];

export const adminLoginValidator = () => [
  body("secretKey", "Please Enter Secret Key").notEmpty(),
];




export const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(errorMessages, 400));
};
