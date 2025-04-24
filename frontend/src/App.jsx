// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lounge from "./pages/lounge/Lounge";
import Login from "./components/Login";
import RegisterPage from "./components/RegisterPage/Register";
import CreateAccount from "./components/RegisterPage/Register1";
import Setup from "./components/RegisterPage/Register2";
import BusinessSetup from "./components/RegisterPage/BusinessRegister";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lounge />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/create-account" element={<CreateAccount />}/>
        <Route path="/account-setup" element={<Setup />}/>
        <Route path="/business-setup" element={<BusinessSetup />}/>

      </Routes>
    </Router>
  );
};

export default App;
