import { useState, useRef, useEffect } from "react";
import { apiEndpoints } from "../Api";
import { useNavigate } from "react-router-dom";

const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
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

  const sendOtpToBackend = async () => {
    setLoading(true);
    const otpString = otp.join("");
    const data = {
      otp: otpString,
    };

    try {
      const response = await apiEndpoints.verifyOtp(data);
      console.log(response.data);

      if (response.data.message === "User is now verified") {
        setIsVerified(true);
        navigate("/main");
      } else {
        setError("OTP is incorrect. Please try again.");
      }
    } catch (error) {
      setError("Error verifying OTP. Please try again.");
      console.error("Error verifying OTP", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    sendOtpToBackend();
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(30);
    setCanResend(false);
    setError(null);
  };

  return (
    <div
      style={{
        backgroundImage: `url("/Background.svg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6"
    >
      {/* Softened overlay for contrast without obscuring the background image */}
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-lg mx-auto bg-black rounded-2xl shadow-2xl p-6 sm:p-12 transform transition-all duration-300 hover:shadow-3xl">
        {/* Centered Verify OTP text in white */}
        <p className="text-2xl font-semibold text-white mb-4 text-center">
          {isVerified ? "Verified" : "Verify OTP"}
        </p>
        <div className="flex justify-center gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-300 transition-all duration-300 bg-gray-100"
            />
          ))}
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        {!canResend ? (
          <p className="text-gray-500 text-sm absolute top-4 right-4">{timer}s</p>
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
            onClick={handleSubmit}
            className="w-full bg-red-600 text-white hover:bg-red-700 transition-all p-2 rounded-lg mt-4"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Otp;
