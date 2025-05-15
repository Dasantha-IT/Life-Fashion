import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dep_name: emp.department.dep_name,
            name: emp.userId.name,
            dob: new Date(emp.dob).toLocaleDateString(),
            profileImage: (
              <img
                width={40}
                className="rounded-full"
                src={`http://localhost:5000/${emp.userId.profileImage}`}
                alt="Profile"
              />
            ),
            action: (
              <div className="flex space-x-3">
                <button
                  className="px-3 py-1 bg-teal-600 text-white"
                  onClick={() =>
                    navigate(`/admin-dashboard/employees/${emp._id}`)
                  }
                >
                  View
                </button>
                <button
                  className="px-3 py-1 bg-yellow-600 text-white"
                  onClick={() =>
                    navigate(`/admin-dashboard/employees/edit/${emp._id}`)
                  }
                >
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-600 text-white">
                  Leave
                </button>
              </div>
            ),
          }));

          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setEmpLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleFilter = (e) => {
    const records = employees.filter((emp) =>
      emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredEmployees(records);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee List", 14, 10);

    const tableData = filteredEmployee.map((emp) => [
      emp.sno,
      emp.name,
      emp.dep_name,
      emp.dob,
    ]);

    autoTable(doc, {
      head: [["S.No", "Name", "Department", "DOB"]],
      body: tableData,
      startY: 20,
    });

    doc.save("employee_list.pdf");
  };

  const columns = [
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
      center: true,
    },
  ];

  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Employees</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search By Emp Name"
          className="px-4 py-0.5 border"
          onChange={handleFilter}
        />
        <div className="flex gap-2">
          <button
            onClick={exportPDF}
            className="px-4 py-1 bg-indigo-600 rounded text-white"
          >
            Download PDF
          </button>
          <Link
            to="/admin-dashboard/add-employee"
            className="px-4 py-1 bg-teal-600 rounded text-white"
          >
            Add New Employee
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredEmployee}
        pagination
        progressPending={empLoading}
      />
    </div>
  );
};

export default List;
