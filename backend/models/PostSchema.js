import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default: "",
  },
  links: {
    type: [String], 
    default: [],
    validate: {
      validator: function (v) {
        return v.every(url => /^https?:\/\/\S+$/.test(url));
      },
      message: props => `${props.value} contains invalid URLs`,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Post", PostSchema);

