import { useState, useRef, useEffect, useCallback } from "react";
import { apiEndpoints } from "../Api";
import { useNavigate } from "react-router-dom";

const Otp = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(countdown);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Move focus to next field if available
        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = useCallback(async () => {
        setLoading(true);
        const otpString = otp.join("");
        const data = {
            otp: otpString,
            tempUserId: sessionStorage.getItem("tempUserId"),
        };

        try {
            const response = await apiEndpoints.verifyOtp(data);
            if (response.data.message === "OTP verified") {
                sessionStorage.clear();
                console.log(response);
                const { token } = response.data;
                localStorage.setItem("accessToken", token.accessToken);
                localStorage.setItem("refreshToken", token.refreshToken);

                navigate("/main");
            } else {
                setError("OTP is incorrect. Please try again.");
            }
        } catch (error) {

            setError(error.response?.data?.message || "Error verifying OTP. Please try again.");
            console.error("Error verifying OTP", error);
        } finally {
            setLoading(false);
        }
    }, [otp, navigate]);

    const handleResend = async () => {
        const data = {
            tempUserId: sessionStorage.getItem("tempUserId"),
            email: sessionStorage.getItem("email"),
        };
        try {
            setOtp(["", "", "", "", "", ""]);
            setTimer(30);
            setCanResend(false);
            setError(null);
            await apiEndpoints.resendOtp(data);
        } catch (error) {
            setError("Error resending OTP. Please try again.");
            console.error("Error resending OTP", error);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").replace(/\D/g, ""); // Only digits
        if (paste.length === otp.length) {
            const pasteArray = paste.split("");
            setOtp(pasteArray);

            // Move focus to the last input
            inputRefs.current[otp.length - 1].focus();
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const dropped = e.dataTransfer.getData("text").replace(/\D/g, ""); // Only digits
        if (!dropped) return;
        const newOtp = [...otp];
        let start = inputRefs.current.findIndex(
            (ref) => ref === document.activeElement
        );
        if (start === -1) start = 0;
        for (let i = 0; i < dropped.length && start + i < otp.length; i++) {
            newOtp[start + i] = dropped[i];
        }
        setOtp(newOtp);

        // Move focus to the last filled input
        const nextFocus = Math.min(start + dropped.length, otp.length - 1);
        inputRefs.current[nextFocus].focus();
    };

    useEffect(() => {
        if (otp.every((digit) => digit !== "")) {
            handleSubmit();
        }
    }, [otp, handleSubmit]);

    return (
        <div className="relative bg-dark-background h-[100dvh] flex items-center justify-center bg-cover bg-center px-4 sm:px-6">
            {/* Softened overlay for contrast without obscuring the background image */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-md md:max-w-lg mx-auto bg-surface rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Centered Verify OTP text */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary bg-clip-text leading-tight animate-fade-in-down">
                        Verify OTP
                    </h1>
                </div>
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
                        <p className="text-red-400 text-center text-sm">
                            {error}
                        </p>
                    </div>
                )}
                <div className="flex justify-center gap-2 mb-4">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength="1"
                            value={digit}
                            onPaste={handlePaste}
                            onDrop={handleDrop}
                            disabled={loading}
                            ref={(el) => (inputRefs.current[index] = el)}
                            onChange={(e) =>
                                handleChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl md:text-2xl font-medium border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-300 transition-all duration-300 bg-gray-100"
                        />
                    ))}
                </div>
                {!canResend ? (
                    <p className="text-gray-500 text-sm absolute top-4 right-4">
                        {timer}s
                    </p>
                ) : (
                    <button
                        onClick={handleResend}
                        className="text-red-600 hover:underline mt-4"
                        disabled={loading}
                    >
                        Resend OTP
                    </button>
                )}
                {otp.every((digit) => digit !== "") && (
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg shadow-lg ${
                            loading
                                ? "bg-primary-light cursor-not-allowed"
                                : "bg-primary hover:bg-primary-dark"
                        } text-primary font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Verifying...
                            </span>
                        ) : (
                            "Verify OTP"
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Otp;
