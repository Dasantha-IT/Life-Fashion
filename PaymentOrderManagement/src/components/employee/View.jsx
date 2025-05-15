import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const View = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.message || "Failed to fetch employee.");
        }
      }
    };

    fetchEmployee();
  }, [id]);

  const imagePath = employee?.profileImage
    ? `http://localhost:5000/uploads/${employee.profileImage}`
    : "https://via.placeholder.com/150";

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-8 text-center">Employee Details</h2>
      {employee ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center items-start">
            <img
              src={imagePath}
              alt="Profile"
              className="rounded-full border w-52 h-52 object-cover"
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/150")
              }
            />
          </div>
          <div className="space-y-4 text-gray-800">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {employee.userId?.name || "-"}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {employee.userId?.email || "-"}
            </p>
            <p>
              <span className="font-semibold">Employee ID:</span>{" "}
              {employee.employeeId}
            </p>
            <p>
              <span className="font-semibold">Date of Birth:</span>{" "}
              {new Date(employee.dob).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Gender:</span> {employee.gender}
            </p>
            <p>
              <span className="font-semibold">Marital Status:</span>{" "}
              {employee.maritalStatus}
            </p>
            <p>
              <span className="font-semibold">Department:</span>{" "}
              {employee.department?.dep_name || employee.department}
            </p>
            <p>
              <span className="font-semibold">Designation:</span>{" "}
              {employee.designation}
            </p>
            <p>
              <span className="font-semibold">Salary:</span> Rs.{" "}
              {employee.salary}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading employee data...</p>
      )}
    </div>
  );
};

export default View;
