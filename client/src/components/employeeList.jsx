import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllEmployees } from '../services/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees();
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div>
      <h1>Employee List</h1>
      <Link to="/add">Add New Employee</Link>
      <ul>
        {employees.map((employee) => (
          <li key={employee.idNumber}>
            <h2>{employee.name} {employee.surname}</h2>
            <p>Role: {employee.role}</p>
            <p>Age: {employee.age}</p>
            <img src={employee.photoUrl} alt="Employee" width="100" />
            <Link to={`/edit/${employee.idNumber}`}>Edit</Link> | 
            <button onClick={() => deleteEmployee(employee.idNumber)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
