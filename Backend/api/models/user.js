import { Schema, model, models } from "mongoose";

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


//User in the  refers to the name of the collection
export const User = models.User || model("User", schema);
