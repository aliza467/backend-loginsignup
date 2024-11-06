import mongoose from "mongoose";

const Schema=mongoose.Schema({
    title:String,
    desc:String,
    postId:Number,

})

const postModal =mongoose.model("post",Schema)

export default postModal