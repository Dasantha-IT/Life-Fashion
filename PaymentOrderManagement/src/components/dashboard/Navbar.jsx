import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    // Add other items if needed (like role, email, etc.)
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <div className="flex items-center text-white justify-between h-12 bg-teal-600 px-5">
      <p>Welcome {name}</p>
      <button
        className="px-4 py-1 bg-teal-700 hover:bg-teal-800"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
