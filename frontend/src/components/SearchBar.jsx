import React from "react";

const SearchBar = () => {
  return (
    <div className="flex justify-center my-4">
        <div className="bg-white rounded-full flex items-center px-4 py-2 w-[850px]">
          <input
            type="text"
            placeholder="add a new post/review/updates"
            className="text-sm text-pink-500 placeholder-black-300 bg-transparent focus:outline-none flex-1"
          />
          <button>
            <span className="text-orange-400 text-xl">&#9654;</span> {/* arrow */}
          </button>
        </div>
      </div>
  );
};

export default SearchBar;

