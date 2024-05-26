

import express from "express";
import { getMyProfile, login,newUser,logout,searchUser } from "../controllers/user.controllers.js";
import {  singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { registerValidator,  validateHandler } from "../lib/validators.js";
const router=express.Router();

/*validateHandler is likely a middleware function that processes the results of the validation defined in registerValidator(). This function checks for validation errors and sends appropriate responses if there are any validation errors.*/
/*registerValidator() defines the validation rules.
validateHandler processes the results of those validation rules and handles any errors.*/
/*registerValidator() is executed first to apply the validation rules to the incoming request.
validateHandler is executed next to check the results of the validation and handle errors accordingly.*/
router.post("/new",singleAvatar,registerValidator(),validateHandler,newUser)
router.post("/login",login)

//after here user must be loggedin to access the routes


//the isauthenticated middleware will run before running of any of the below functions
router.use(isAuthenticated)
router.get("/me",getMyProfile);
router.get("/logout",logout);
router.get("/search",searchUser)



export default router;