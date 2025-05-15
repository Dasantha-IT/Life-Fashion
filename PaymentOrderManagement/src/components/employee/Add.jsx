import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/department", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDepartments(res.data.departments || []);
      } catch (error) {
        console.error("Failed to load departments:", error);
      }
    };

    loadDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/employee/add",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        navigate("/admin-dashboard/employees");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert(error?.response?.data?.error || "Error adding employee");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Employee</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {[
          ["name", "Name", "text"],
          ["email", "Email", "email"],
          ["employeeId", "Employee ID", "text"],
          ["dob", "Date of Birth", "date"],
          ["designation", "Designation", "text"],
          ["salary", "Salary", "number"],
          ["password", "Password", "password"],
        ].map(([name, label, type]) => (
          <div key={name}>
            <label className="block font-medium text-gray-700">{label}</label>
            <input
              name={name}
              type={type}
              required
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
        ))}

        <div>
          <label className="block font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            required
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Marital Status
          </label>
          <select
            name="maritalStatus"
            required
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Department</label>
          <select
            name="department"
            required
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.dep_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Role</label>
          <select
            name="role"
            required
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Profile Image
          </label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
