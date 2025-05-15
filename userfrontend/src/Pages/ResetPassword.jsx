import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");
  const otp = query.get("otp");

  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/forgot-password/reset",
        {
          email,
          otp,
          newPassword,
        }
      );

      if (res.data.success) {
        toast.success("Password reset successful");
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Reset failed");
    }
  };

  return (
    <form
      onSubmit={handleReset}
      className="w-[90%] max-w-md m-auto mt-20 flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold text-center">Set New Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border px-3 py-2"
        required
      />
      <button type="submit" className="bg-black text-white py-2">
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
