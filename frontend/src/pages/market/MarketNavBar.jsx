


import { Link } from "react-router-dom"; 

const MarketNavBar = () => {
  return  (
    <nav className="w-full bg-[#ECA95E] px-6 py-3 flex  relative top-[-25px] flex-col items-center rounded-b-md justify-between">
     
      {/* Navigation Links */}
      <div className="flex items-center gap-6 text-black font-medium text-sm ">
      <Link to="/market-explore" className="hover:text-black hover:underline hover:decoration-[#000000] hover:underline-offset-[3px]">Explore</Link>
      <Link to="/Shops" className="hover:text-black hover:underline hover:decoration-[#000000] hover:underline-offset-[3px] ">Shops</Link>
      <Link to="/Thrift" className="hover:text-black hover:underline hover:decoration-[#000000] hover:underline-offset-[3px]">Thrift</Link>
      </div>

      
    </nav>
  );
};

export default MarketNavBar;

