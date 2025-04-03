import React, { useState, useEffect } from "react";
import Leftsection from "./Leftsection";
import RightSection from "./Rightsection";

const Main = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Add window resize listener
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Hide/show navbar based on mobile view and selected chat
    useEffect(() => {
        const navbar = document.querySelector("header");
        if (navbar) {
            if (isMobile && selectedChat) {
                navbar.style.display = "none";
            } else {
                navbar.style.display = "block";
            }
        }
    }, [isMobile, selectedChat]);

    return (
        <main className={`${isMobile ? "h-screen" : "h-[calc(100vh-88px)]"} bg-background`}>
            <div className={`container mx-auto ${isMobile ? "h-screen" : "h-[calc(100vh-88px)]"} flex flex-col md:flex-row p-2 sm:p-4 gap-4`}>
                {/* Left Section (Chats List) */}
                <aside
                    className={`md:w-1/3 lg:w-1/4 bg-surface rounded-lg mb-4 md:mb-0 ${
                        isMobile && selectedChat ? "hidden" : "block"
                    }`}
                >
                    <Leftsection onSelectChat={setSelectedChat} />
                </aside>

                {/* Right Section (Chat) */}
                <section
                    className={`flex-1 bg-surface rounded-lg shadow-lg flex flex-col ${
                        isMobile && !selectedChat ? "hidden" : "block"
                    }`}
                >
                    <RightSection
                        selectedChat={selectedChat}
                        onBackClick={() =>
                            isMobile ? setSelectedChat(null) : null
                        }
                        isMobile={isMobile}
                    />
                </section>
            </div>
        </main>
    );
};

export default Main;
