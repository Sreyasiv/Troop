import React from "react";

const SearchBar = ({ onSearch }) => {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex justify-center my-4 px-4 sm:px-0">
      <div className="bg-white rounded-full flex items-center px-4 py-2 w-full max-w-[2050px] max-h-[194px] transition-shadow">
        <input
          type="text"
          placeholder="Search"
          className="text-[#ff8800] placeholder-black-300 w-full sm:w-[500px] xl:w-[1050px] flex-1 text-sm sm:text-base bg-transparent outline-none"
          onChange={handleChange}
        />
        <button>
          <span className="text-orange-400 text-xl">&#9654;</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
