import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import userRoute from "../api/routes/user.routes.js"
import chatRoute from "../api/routes/chat.routes.js"
import adminRoute from "../api/routes/admin.routes.js"
import { connectDB } from "../api/utils/features.js";


import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import { createMessagesInAChat } from "./seeders/chat.js";





dotenv.config();
//mongoURI=process.env.MONGO_URI;
connectDB("mongodb://localhost:27017/ChatterBox");

var app = express();

app.use(logger('dev'));
//express.json is used to access the json data from the frontend
app.use(express.json());
//express.urlencoded is used when we send form data from the frontend
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// createSingleChats(10);
// createGroupChats(10);
//createMessagesInAChat("6652fad5328fb55d8d43b9dc",50)


app.use("/user", userRoute)
app.use("/chat", chatRoute)
app.use("/admin", adminRoute)

app.get("/",(req,res)=>{
  res.send("Hello  WORLD !")
})



app.use(errorMiddleware)

export const adminSecretKey=process.env.ADMIN_SECRET_KEY||"rohitIeeeCs96"

const port =5000;
export const envMode=process.env.NODE_ENV.trim()||"PRODUCTION";
app.listen(port, () => {
    console.log(`Server is running on port ${port} in ${envMode} mode `);
  });





export default app;
