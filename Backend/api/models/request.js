import mongoose,{ Schema, Types, model } from "mongoose";

const schema = new Schema(
  {
    status: {
      type:String,
      default:"pending",
      enum:["pending","accepted","rejected"]
    },
    sender: {
      type: Types.ObjectId,
      ref: "User", //it refers to the user collection ,
      required: true,
    },
    receiver: {
      //it will contain the chatid
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
},{
    timestamps:true
});

export const Request = mongoose.models.Request || model("Request", schema);
