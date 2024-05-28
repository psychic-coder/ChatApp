import mongoose,{ Schema, model } from "mongoose";
import bcrypt from "bcrypt"

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    //we made the select false , which means whenever we'll fetch all the data from mongodb, we'll receive all the data except the password, until and unless we specifically ask for it
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
},{
    timestamps:true
});


//the below code means before saving the user , this.password points towards the passowrd
//this.password refers to the password field of the current document instance being saved, and the code is hashing the password before storing it
//The line if (!this.isModified("password")) next(); is a conditional statement that checks if the password field of the current document has been modified or not. If the password field has not been modified, it calls the next() function, which allows the middleware to skip the password hashing process and proceed to the next middleware or save the document directly.
schema.pre("save",async function(next){
  if(!this.isModified("password")) return next();
this.password=await bcrypt.hash(this.password,10);
})


//User in the  refers to the name of the collection
export const User = mongoose.models.User || model("User", schema);
