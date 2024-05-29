import { envMode } from "../app.js";

export const errorMiddleware = (err, req, res, next) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  /*err.keyPattern: This is an object provided by Mongoose in the error object when a duplicate key error occurs. The keyPattern object contains the fields that triggered the duplicate key error. For example, if there is a unique constraint on the username and email fields, and the insertion attempt violates either constraint, keyPattern will include those field names as keys.

Object.keys(err.keyPattern): This Object.keys method is used to get an array of the keys (field names) from the keyPattern object. For example, if keyPattern is { username: 1, email: 1 }, Object.keys will return ["username", "email"].*/
  //it means duplicate key error
  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(",");
    err.message = `Duplicate field - ${error}`;
    err.statusCode = 400;
  }

  /*a CastError occurs when a value that is assigned to a field in a document does not match the expected type defined in the schema. The err.path property in a CastError refers to the specific field in the document that caused the error.*/
  /*const errorPath = err.path;: This extracts the path property from the error object. The path property specifies the name of the field that caused the casting error.*/
  if (err.name === "CastError") {
    const errorPath = err.path;
    err.message = `Invalid Format of ${errorPath}`;
    err.statusCode = 400;
  }

  const response = {
    success: false,
    message: err.message,
  };

  if (envMode === "DEVELOPMENT") {
    response.error = err;
  }

  return res.status(err.statusCode).json(response);
};

//we will use the below as a wrapper ,
//passedFunc it holds the value of the function we passed
export const TryCatch = (passedFunc) => async (req, res, next) => {
  try {
    await passedFunc(req, res, next);
  } catch (error) {
    next(error);
  }
};