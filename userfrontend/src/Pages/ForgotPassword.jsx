import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/forgot-password/send-otp",
        {
          email,
        }
      );
      if (res.data.success) {
        toast.success("OTP sent to your email");
        navigate(`/verify-otp?email=${email}`);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  return (
    <form
      onSubmit={handleSendOTP}
      className="w-[90%] max-w-md m-auto mt-20 flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold text-center">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-2"
        required
      />
      <button type="submit" className="bg-black text-white py-2">
        Send OTP
      </button>
    </form>
  );
};

export default ForgotPassword;
