import { isValidUsername } from "6pp";



//isvalidUsername is from the6pp package
export const usernameValidator=(username)=>{

    if(!isValidUsername(username))
   return  { isValid: false, errorMessage: "Username is invalid" };
}