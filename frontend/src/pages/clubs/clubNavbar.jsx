import { Link } from "react-router-dom";

const ClubNavBar = () => {
  return (
    <nav className="w-full bg-[#3c6c72] text-white px-6 py-3 flex relative top-[-25px] flex-col items-center rounded-b-md">
      {/* Navigation Links */}
      <div className="flex items-center gap-6 font-medium text-sm">
        <Link
          to="/clubs"
          className="text-white hover:text-gray-300 hover:underline hover:decoration-[#ffffff] hover:underline-offset-[3px]"
        >
          Clubs at VISTAS
        </Link>
        <Link
          to="/club-buzz"
          className="text-white hover:text-gray-300 hover:underline hover:decoration-[#ffffff] hover:underline-offset-[3px]"
        >
          Latest Buzz
        </Link>
      </div>
    </nav>
  );
};

export default ClubNavBar;