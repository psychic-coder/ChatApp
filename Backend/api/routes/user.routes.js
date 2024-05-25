

import express from "express";
import { getMyProfile, login,newUser,logout } from "../controllers/user.controllers.js";
import {  singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router=express.Router();


router.post("/new",singleAvatar,newUser)
router.post("/login",login)

//after here user must be loggedin to access the routes


//the isauthenticated middleware will run before running of any of the below functions
router.use(isAuthenticated)
router.get("/me",getMyProfile);
router.get("/logout",logout);



export default router;