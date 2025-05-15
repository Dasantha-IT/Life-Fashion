import axios from 'axios'
import { useNavigate } from "react-router-dom"



export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno,
    },
    {
        name: "Department Name",
        selector: (row) => row.dep_name,
        sortable: true
    },
    {
        name: "Action",
        selector: (row) => row.action
    },
]

export const DepartmentButtons = ({ Dep_Id, onDepartmentDelete }) => {
    
    const navigate = useNavigate()

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this department?")
        if(confirm) {
        try{                                
            const responnse = await axios.delete(`http://localhost:3002/api/department/${id}`, 
                {
              headers: {
                "Authorization" : `Bearer ${localStorage.getItem('token')}`
              },
            })
     //       console.log(responnse.data)
            if(responnse.data.success) {
                onDepartmentDelete(id)
            }
          }catch(error){
            if(error.response && !error.response.data.success) {
              alert(error.response.data.error)
            }
          }
        }
    };

    return(
        <div className="flex space-x-3">
            <button className="px-3 py-1 bg-teal-600 text-white"
                onClick={() => navigate(`/admin-dashboard/department/${Dep_Id}`) }
            >Edit</button>
            <button className="px-3 py-1 bg-red-600 text-white"
                onClick={() => handleDelete(Dep_Id)}
            >Delete</button>
        </div>
    )
}