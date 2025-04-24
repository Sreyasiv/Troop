import React from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center my-4">
      <div
        onClick={() => navigate("/post")}
        className="bg-white rounded-full flex items-center px-4 py-2 w-[850px] cursor-pointer hover:shadow-md transition-shadow"
      >
        <input
          type="text"
          placeholder="add a new post/review/updates"
          className="text-[#ff8800] placeholder-black-300 flex-1 pointer-events-none"
          readOnly
        />
        <button>
          <span className="text-orange-400 text-xl">&#9654;</span> {/* arrow */}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
