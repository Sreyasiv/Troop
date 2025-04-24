import React, { useState } from "react";
import heart from "../assets/heart.png";   // update path as needed
import heartf from "../assets/heartf.png";

const Post = ({ username, course, profilePic, content, hashtags, images }) => {
  const [liked, setLiked] = useState(false);
  const toggleHeart = () => {
    setLiked(prev => !prev);
  };
  return (
    
    <div className="bg-[#2c2c2c] w-[950px] rounded-2xl overflow-hidden p-6 text-white shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 ">
        <div className="flex items-center gap-3">
          <img
            src={profilePic}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-bold uppercase text-sm">{username}</p>
            <p className="text-xs text-gray-300">{course}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
          {hashtags.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 rounded-full bg-gray-700 text-blue-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="mb-4 text-base font-medium text-gray-100">{content}</div>

      {/* Images (if any) */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Post image ${i + 1}`}
              className="w-full h-40 object-cover rounded-xl"
            />
            
          ))}
        </div>

        
        
      )}
      <div className="mt-2">
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
