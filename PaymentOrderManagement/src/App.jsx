import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Stock Manager Pages
import Add from "./pages/StockManagerPages/Add";
import List from "./pages/StockManagerPages/List";
import Orders from "./pages/StockManagerPages/Orders";
import Deliveries from "./pages/StockManagerPages/Deliveries";

// Admin Pages
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/department/DepartmentList";
import AddDepartment from "./components/department/AddDepartment";
import EditDepartment from "./components/department/EditDepartment";
import EmployeeList from "./components/employee/List";
import AddEmployee from "./components/employee/Add";
import ViewEmployee from "./components/employee/View";
import EditEmployee from "./components/employee/Edit";
import ReturnDashboard from "./pages/AdminPages/ReturnDashbord";

// Employee Pages
import EmployeeDashboard from "./pages/AdminPages/EmployeeDashboard";
import Summary from "./components/EmployeeDashboard/Summary";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "Rs. ";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const role = localStorage.getItem("role");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  if (!token) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <ToastContainer />
        <Login setToken={setToken} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {role === "stock_admin" && (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="*" element={<h1>Route Not Found</h1>} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route
                  path="/deliveries"
                  element={<Deliveries token={token} />}
                />
                <Route path="*" element={<Navigate to="/add" />} />
              </Routes>
            </div>
          </div>
        </>
      )}

      {role === "main_admin" && (
        <Routes>
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<AdminSummary />} />
            <Route path="departments" element={<DepartmentList />} />
            <Route path="add-department" element={<AddDepartment />} />
            <Route path="department/:id" element={<EditDepartment />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="returns" element={<ReturnDashboard />} />
            <Route path="add-employee" element={<AddEmployee />} />
            <Route path="employees/:id" element={<ViewEmployee />} />
            <Route path="employees/edit/:id" element={<EditEmployee />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin-dashboard" />} />
        </Routes>
      )}

      {role === "employee" && (
        <Routes>
          <Route path="/employee-dashboard" element={<EmployeeDashboard />}>
            <Route index element={<Summary />} />
          </Route>
          <Route path="*" element={<Navigate to="/employee-dashboard" />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
