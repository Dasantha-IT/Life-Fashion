import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "100px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "150px",
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    width: "150px",
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    width: "190px",
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
    sortable: true,
    width: "150px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    $center: true,
  },
];

export const fetchDepartments = async () => {
  let departments;
  try {
    const responnse = await axios.get("http://localhost:3002/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (responnse.data.success) {
      departments = responnse.data.departments;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return departments;
};

export const EmployeeButtons = ({ Dep_Id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-600 text-white"
        onClick={() => navigate(`/admin-dashboard/employees/${Dep_Id}`)}
      >
        view
      </button>

      <button
        className="px-3 py-1 bg-yellow-600 text-white"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${Dep_Id}`)}
      >
        Edit
      </button>

      <button className="px-3 py-1 bg-red-600 text-white">Leave</button>
    </div>
  );
};
