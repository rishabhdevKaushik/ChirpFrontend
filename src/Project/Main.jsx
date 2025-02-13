import React, { useState } from "react";
import Leftsection from "./Leftsection";
import RightSection from "./Rightsection";

const Main = () => {
    const [selectedFriend, setSelectedFriend] = useState(null);

    return (
        <main className="h-screen bg-gray-50">
            <div className="container mx-auto h-screen flex flex-col md:flex-row p-4">
                {/* Left Section (Friends List) */}
                <aside className="md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 rounded-l-lg shadow-lg">
                    <div className="h-full p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                        <Leftsection onSelectFriend={setSelectedFriend} />
                    </div>
                </aside>

                {/* Right Section (Chat) */}
                <section className="flex-1 bg-gray-50 rounded-r-lg shadow-lg">
                    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                        <RightSection selectedFriend={selectedFriend} />
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Main;
