import { useState } from "react";
import { addEmployee } from "../services/employeeService.js";

function Add() {
    const  [employeeData, setEmployeeData] = useState ({
        name: "",
        surname: "",
        email: "",
        idNumber: "",
        position: ""
    })

    const [photo, setPhoto] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newEmployee = await addEmployee(employeeData, photo)
        console.log("Employee added", newEmployee)

        return(
            <div>
                <h1>Employee Information</h1>
                <form onSubmit={handleSubmit}>
                    <lable>Name</lable>
                    <input type="text" placeholder="First Name" value={employeeData.name} onChange={(e) => setEmployeeData({...employeeData, name: e.target.value})} required/>
                    <input type="text" placeholder="Last Name" value={employeeData.surname} onChange={(e) => setEmployeeData({...employeeData, surname: e.target.value})} required/>
                    <input type="text" placeholder="Email Address" value={employeeData.email} onChange={(e) => setEmployeeData({...employeeData, email: e.target.value})} required/>
                    <input type="text" placeholder="ID Number" value={employeeData.idNumber} onChange={(e) => setEmployeeData({...employeeData, idNumber: e.target.value})} required/>
                    <input type="text" placeholder="Position" value={employeeData.position} onChange={(e) => setEmployeeData({...employeeData, position: e.target.value})} required/>
                    <input type="file" onChange={(e) => setPhoto(e.target.files[0])}/>
                    <button type="submit">Add Employee</button>
                </form>
            </div>
        )
    }
}

export default Add