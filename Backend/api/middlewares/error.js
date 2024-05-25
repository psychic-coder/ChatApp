export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error !!";
  err.statusCode || 500;

  const response = {
    success: false,
    message: err.message,
  };

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
