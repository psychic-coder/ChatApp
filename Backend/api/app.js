import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import userRoute from "../api/routes/user.routes.js"

import dotenv from "dotenv";

dotenv.config();


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use("/user",userRoute)

app.get("/",(req,res)=>{
  res.send("Hello  WORLD !")
})



const port =5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });





  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });


export default app;
