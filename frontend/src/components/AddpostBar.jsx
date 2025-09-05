import React from "react";
import { useNavigate } from "react-router-dom";

const AddpostBar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center my-4 px-4 sm:px-0">
      <div
        onClick={() => navigate("/post")}
        className="bg-white rounded-full flex items-center px-4 py-2 w-full max-w-[2050px] cursor-pointer hover:shadow-md transition-shadow"
      >
        <input
          type="text"
          placeholder="Add a new post / Review / Update"
          className="text-[#ff8800] placeholder-black-300 w-full sm:w-[500px] md:w-[650px] lg:w-[800px] xl:w-[950px] flex-1 pointer-events-none text-sm sm:text-base bg-transparent outline-none"
          readOnly
        />

        <button>
          <span className="text-orange-400 text-xl">&#9654;</span>
        </button>
      </div>
    </div>
  );
};

export default AddpostBar;
