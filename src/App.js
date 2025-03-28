import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Project/Login"; // Default page
import SignupPage from "./Project/SignupPage"; // Signup page
import Main from "./Project/Main";
import Otp from "./Project/Otp";
import Popup from "./Project/Popup";
import Profile from "./Project/Profile";
import UpdateProfile from "./Project/UpdateProfile";
import LoadingScreen from "./Project/Loadingpage";
import Navbar from "./Project/Navbar";
import Settings from "./Project/Settings";
const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Routes WITHOUT Navbar */}
                    <Route path="/" element={<LoadingScreen />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/otp" element={<Otp />} />
                    {/* Routes WITH Navbar */}
                    <Route element={<LayoutWithNavbar />}>
                        <Route path="/main" element={<Main />} />
                        <Route path="/popup" element={<Popup />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route
                            path="/updateprofile"
                            element={<UpdateProfile />}
                        />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

// Layout component to include Navbar only for specific routes
const LayoutWithNavbar = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/main" element={<Main />} />
                <Route path="/popup" element={<Popup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/updateprofile" element={<UpdateProfile />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </>
    );
};

export default App;
