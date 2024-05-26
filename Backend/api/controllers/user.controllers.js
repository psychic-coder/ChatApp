import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";

export const newUser = async (req, res, next) => {
  const avatar = {
    public_id: "efw",
    url: "jhsfjhs",
  };

  const { name, username, password, bio } = req.body;

  const user = await User.create({
    name,
    username,
    password,
    bio,
    avatar,
  });

  sendToken(res, user, 201, "User Created !");
};
export const login = TryCatch(async(req,res,next)=>{
    const { username, password } = req.body;
    //as in the models while creating we have made the default password select=false, so we're particularly asking for the password from the database
    const user = await User.findOne({ username }).select("+password");
    //the next keyword will automatically call the error middlware
    if(!user) return next(new ErrorHandler("Invalid Credentials !!",400));
    const isMatch = await compare(password, user.password);
    if (!isMatch) 
      return next(new ErrorHandler("Invalid Credentials !!",400));
  
      sendToken(res, user, 200, `Welcome Back ${user.name} !`);
})

export const getMyProfile=TryCatch(async(req,res,next)=>{
    
 //we're simply setting the value of the cookie to null , overwriting the cookieOptions maxage to 0
  return res.status(200).cookie("access_token","",{...cookieOptions,maxAge:0}).json({
         success:true,
         message:" LoggedOut Successfully !!"
     });
 });


export const logout=TryCatch(async(req,res,next)=>{
    const user= await User.findById(req.user);
 
     res.status(200).json({
         success:true,
         user
     });
 });
export const searchUser=TryCatch(async(req,res,next)=>{
    const {name}=req.query;

    return res.status(200).json({
        success:true,
        message:name,
    })
 });
