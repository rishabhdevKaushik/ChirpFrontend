import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./Project/Page"; // Default page
import SignupPage from "./Project/SignupPage"; // Signup page
import Main from "./Project/Main";
import Popup from "./Project/Popup";
import Profile from "./Project/Profile";
import UpdateProfile from "./Project/UpdateProfile";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Default route ( login ) */}
          <Route path="/" element={<Page />} />
          {/* Route for Signup Page */}
          <Route path="/Signup" element={<SignupPage />} />
          {/* Route for Main Page */}
          <Route path="/main" element={<Main />} />
          {/* Route for Popup */}
          <Route path="/popup" element={<Popup />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/UpdateProfile" element={<UpdateProfile/>}/>
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
