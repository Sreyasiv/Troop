import React, { useState } from "react";
import heart from "../assets/heart.png";
import heartf from "../assets/heartf.png";

const Post = ({ username, course, profilePic, content, hashtags, images }) => {
  const [liked, setLiked] = useState(false);

  const toggleHeart = () => {
    setLiked(prev => !prev);
  };

  return (
    <div className="bg-[#2c2c2c] w-full max-w-[2050px]  rounded-2xl overflow-hidden p-4 sm:p-6 text-white shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex items-center gap-3">
          <img
            src={profilePic}
            alt="Profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-bold uppercase text-sm sm:text-base">{username}</p>
            <p className="text-xs sm:text-sm text-gray-300">{course}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-end sm:max-w-[200px]">
          {hashtags.map((tag, i) => (
            <span
              key={i}
              className="text-xs sm:text-sm px-2 py-1 rounded-full bg-gray-700 text-blue-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="mb-4 text-sm sm:text-base font-medium text-gray-100">{content}</div>

      {/* Images */}
      {images.length > 0 && (
        <div className={`grid gap-4 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Post image ${i + 1}`}
              className="w-full h-40 sm:h-48 object-cover rounded-xl"
            />
          ))}
        </div>
      )}

      {/* Like Button */}
      <div className="mt-3">
        <img
          src={liked ? heartf : heart}
          alt="heart"
          onClick={toggleHeart}
          className="w-6 h-6 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Post;
