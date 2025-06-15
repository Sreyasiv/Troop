import React,{useState} from "react";
import logo from "../../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";




const Setup=()=>{
    const navigate=useNavigate();
    const [selectedCourse, setSelectedCourse] = useState("");
    const[selectedClubs,setSelectedClubs]=useState([]);
    const [profilePic, setProfilePic] = useState(null);
    const [bio, setBio] = useState("");
    const [ownsBusiness, setOwnsBusiness] = useState();
    const [error, setError] = useState("");


  const courseOptions = [
    "BSc Computer Science",
    "BCom Finance",
    "BA English",
    "B-Tech CSE-SPE-WIP",
    "B-Tech CSE-AI&FT-WIP"
  ];
  const clubOptions=[
    "Aesthetica-(Art)",
    "Resonance-(Music)",
    "ShutterStack-(Photography)",
    "CodeForge-(Coding)"
  ]

    return(
        <div className="flex flex-col items-center justify-center min-h-screen  bg-[#1A1A1A] text-white ">
        { /* Logo */}
        <div className="flex absolute justify-center top-6 left-8 min-h-screen mb-8">
            <img src={logo} alt="Troop Logo" className="h-24" />
        </div>

        {/*Heading*/}
        <div className="text-center justify-center">
            <div className="font-bold text-5xl">Setup your account</div>
            <br></br>
        </div>

        {/*Setup Box*/}
        <div className="bg-[#2D2B2B] rounded-3xl w-full max-w-3xl  flex flex-col ">
        <label className="block mb-2 font-bold text-white p-1.5">Select your Course</label>
        <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-[#D9D9D9] text-black rounded-lg px-4 py-2 w-full">
            <option value="" disabled>Select a course</option>
            {courseOptions.map((course, index) => (
            <option key={index} value={course}>
                {course}
            </option>
            ))}
            
        </select>
        <br></br>
        <label className="block mb-2 font-bold text-white p-1.5">Club/Clubs you are in</label>
<div className="flex flex-col gap-2 px-4">
  {clubOptions.map((club, index) => (
    <label key={index} className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        value={club}
        checked={selectedClubs.includes(club)}
        onChange={(e) => {
          const value = e.target.value;
          if (selectedClubs.includes(value)) {
            setSelectedClubs(selectedClubs.filter((item) => item !== value));
          } else {
            setSelectedClubs([...selectedClubs, value]);
          }
        }}
        className="form-checkbox h-4 w-4 text-orange-500"
      />
      <span>{club}</span>
    </label>
    
    ))}



</div>
<br></br>
<label className="block mb-2 text-white font-bold p-1.5">Add your Profile picture</label>
<label htmlFor="profile-upload" className="cursor-pointer w-24 h-24 rounded-full overflow-hidden border-2 border-gray-500 flex items-center justify-center bg-gray-800">
  {profilePic ? (
    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
  ) : (
    <span className="text-white text-sm">Upload</span>
  )}
</label>
<input
  type="file"
  id="profile-upload"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  }}
  className="hidden"
/>

<br></br>
<label className="block mb-2 font-bold text-white p-1">Add a short bio</label>

<textarea
  type="text"
  value={bio}
  onChange={(e) => setBio(e.target.value)}
  placeholder="e.g., Passionate about art & code"
  className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 w-full"
/>


<br></br>
<label className="block mb-2 font-bold text-white p-1.5">Do you own a business or freelance?</label>
<div className="flex gap-4 mt-4">
  <button
    onClick={() => setOwnsBusiness("yes")}
    className={`px-6 py-2 rounded-full border ${
      ownsBusiness === "yes" ? "bg-[#D4852D] text-white" : "bg-gray-800 text-white border-gray-600"
    }`}
  >
    Yes
  </button>
  <button
    onClick={() => setOwnsBusiness("no")}
    className={`px-6 py-2 rounded-full border ${
      ownsBusiness === "no" ? "bg-[#D4852D] text-white" : "bg-gray-800 text-white border-gray-600"
    }`}
  >
    No
  </button>
</div>
<br></br>
<button
  onClick={() => {
    if (!ownsBusiness) {
      setError("Please answer the last question.");
    } else {
      setError(""); // clear error
      if (ownsBusiness === "yes") {
        navigate("/business-setup");
      } else {
        navigate("/lounge");
      }
    }
  }}
  className="w-full bg-[#D4852D] text-white font-bold py-5 rounded-lg text-3xl hover:bg-black hover:text-[#D4852D] transition-all duration-300"
>
  NEXT
</button>
{error && (
  <div className="text-[#ffa600] text-center mt-2 text-lg font-semibold">
    {error}
  </div>
)}

</div>
    </div> 
    )
}

export default Setup;