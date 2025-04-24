import React,{useState} from "react";
import logo from "../../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";


const BusinessSetup = () => {
  const navigate = useNavigate();
  const [LogoPic, setLogoPic] = useState(null);
return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1A1A] text-white relative px-4">
      {/* Logo */}
      <div className="absolute top-6 left-8 flex items-center">
        <img src={logo} alt="Troop Logo" className="h-24" />
    </div>
    {/* Heading */}
    <div className="text-center mb-8">
        <h2 className="text-5xl font-bold">Create an account</h2>
      </div>

      {/* Register Box */}
      <div className="bg-[#2D2B2B] p-16 rounded-3xl shadow-lg w-full max-w-3xl text-center flex flex-col items-center relative z-20">
        {/* Email */}
        <div className="mb-8 w-full text-left">
          <label className="block mb-2 text-white font-bold p-1.5">
            Name of your Business <span className="text-red-500">*</span>
          </label>
          <input type="text" className="w-full p-1 rounded-lg bg-[#D9D9D9] text-black border-none focus:outline-none text-xl" />
        </div>
        <div className="mb-8 w-full text-left">
        <label className="block mb-2 text-white font-bold p-1.5">
            Add a Tagline
          </label>
          
          <input type="text" className="w-full p-1 rounded-lg bg-[#D9D9D9] text-black border-none focus:outline-none text-xl" />
          <br></br>
          <br></br>
          <label className="block mb-2 text-white font-bold p-1.5">Upload your Business logo</label>
            <label htmlFor="logo-upload" className="cursor-pointer w-24 h-24 rounded-full overflow-hidden border-2 border-gray-500 flex items-center justify-center bg-gray-800">
                  {LogoPic ? (
                      <img src={LogoPic} alt="Logopic" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-sm">Upload</span>
                    )}
            </label>
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setLogoPic(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
              />

            
              <br></br>
            <div className=" w-full text-left">
        <label className="block mb-2 text-white font-bold p-1.5">
            Whatsapp Business
          </label>
          
          <input type="text" className="w-full p-1 rounded-lg bg-[#D9D9D9] text-black border-none focus:outline-none text-xl" />
          </div>
        </div>
        <div className=" w-full text-left">
        <label className="block mb-2 text-white font-bold p-0.5">
            Instagram page link
          </label>
          <input type="text" className="w-full p-1 rounded-lg bg-[#D9D9D9] text-black border-none focus:outline-none text-xl" />

          
          <button onClick={()=>navigate("/")}
          
          className="mt-10 w-full bg-[#D4852D] text-white font-bold py-5 rounded-lg text-3xl hover:bg-black hover:text-[#D4852D] transition-all duration-300">
            SUBMIT

          </button>
          </div>
      </div>
        
  </div>
)
}

export default BusinessSetup;
