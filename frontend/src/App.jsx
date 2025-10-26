

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import RegisterPage from "./components/RegisterPage/Step1Email";
import CreateAccount from "./components/RegisterPage/Step2UserSignup";
import Setup from "./components/RegisterPage/Step3accSetup";
import BusinessSetup from "./components/RegisterPage/Step4BusinessSetup";
import Lounge from "./pages/lounge/Lounge";
import Events from "./pages/events/Event";
import Learn from "./pages/learn/Learn";
import Clubs from "./pages/clubs/Club";
import Explore from "./pages/market/explore";
import Shops from "./pages/market/shops";
import Thrift from "./pages/market/thrift"; 
import Index from "./pages/landing/landingPage";
import Compa from "./pages/Compa/Help"
import ProfilePage from "./pages/profile/profile";
import ClubBuzz from "./pages/clubs/clubBuzz";
import AboutDevPage from "./pages/landing/Aboutdevdrawer";




const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/create-account" element={<CreateAccount />}/>
        <Route path="/account-setup" element={<Setup />}/>
        <Route path="/business-setup" element={<BusinessSetup />}/>
        <Route path="/events" element={<Events/>}/>
        <Route path="/learn" element={<Learn />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/lounge" element={<Lounge/>}/>
        <Route path="/compa" element={<Compa/>}/>
        <Route path="/shops" element={<Shops />} />
        <Route path="/thrift" element={<Thrift />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/club-buzz" element={<ClubBuzz />} />
        <Route path="/dev" element={<AboutDevPage/>}/>

        

      </Routes>
    </Router>
  );
};

export default App;
