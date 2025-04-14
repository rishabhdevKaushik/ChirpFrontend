import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Project/Login";
import SignupPage from "./Project/SignupPage";
import Main from "./Project/Main";
import Otp from "./Project/Otp";
import Popup from "./Project/Popup";
import Profile from "./Project/Profile";
import UpdateProfile from "./Project/UpdateProfile";
import LoadingScreen from "./Project/Loadingpage";
import Navbar from "./Project/Navbar";
import Settings from "./Project/Settings";
import ForgetPassword from "./Project/ForgetPassword";
import ChangePassword from "./Project/ChangePassword";
import AddNew from "./Project/AddNew";
const App = () => {
    return (
        <Router>
            <div className="App h-[100dvh] flex flex-col overflow-hidden">
                <Routes>
                    {/* Routes WITHOUT Navbar */}
                    <Route path="/" element={<LoadingScreen />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/otp" element={<Otp />} />
                    <Route path="/ForgetPassword" element={<ForgetPassword />} />
                    <Route path="/ChangePassword" element={<ChangePassword />} />
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
                        <Route path="/addnew" element={<AddNew />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

// Layout component to include Navbar only for specific routes
const LayoutWithNavbar = () => {
    return (
        <div className="h-full flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1">
                <Routes>
                <Route path="/main" element={<Main />} />
                <Route path="/popup" element={<Popup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/updateprofile" element={<UpdateProfile />} />
                <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
