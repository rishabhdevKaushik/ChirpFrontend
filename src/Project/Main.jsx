import React, { useState } from "react";
import Leftsection from "./Leftsection";
import RightSection from "./Rightsection";

const Main = () => {
    const [selectedFriend, setSelectedFriend] = useState(null); // State for selected friend

    return (
        <>
            <div className="flex flex-col md:flex-row w-full h-screen">
                {/* Left Section (Friends List) */}
                <div className="md:w-1/4 w-full bg-gray-100 p-4 overflow-y-auto">
                    <Leftsection onSelectFriend={setSelectedFriend} />{" "}
                    {/* Pass callback */}
                </div>

                {/* Right Section (Chat) */}
                <div className="md:w-3/4 w-full bg-white p-4 overflow-y-auto">
                    <RightSection selectedFriend={selectedFriend} />{" "}
                    {/* Pass selected friend */}
                </div>
            </div>
        </>
    );
};

export default Main;
