import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");

  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/forgot-password/verify-otp",
        {
          email,
          otp,
        }
      );

      if (res.data.success) {
        toast.success("OTP Verified");
        navigate(`/reset-password?email=${email}&otp=${otp}`);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("OTP verification failed");
    }
  };

  return (
    <form
      onSubmit={handleVerify}
      className="max-w-md mx-auto mt-20 flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold text-center">Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border px-3 py-2"
        required
      />
      <button type="submit" className="bg-black text-white py-2">
        Verify OTP
      </button>
    </form>
  );
};

export default VerifyOTP;
