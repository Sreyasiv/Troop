const mongoose=require("mongoose")

const PostSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    picture:{
        type: String,
        default:""
    },
    links:{
        type:[String], // Allow multiple optional links
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
  }
})

module.exports = mongoose.model('Post', PostSchema);