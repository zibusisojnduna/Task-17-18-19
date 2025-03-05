import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployee } from '../services/api';

const AddEmployee = () => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    surname: '',
    age: '',
    idNumber: '',
    role: '',
  });
  const [photo, setPhoto] = useState(null);
  const history = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEmployee(employeeData, photo);
      history.push('/');  // Redirect to the employee list page
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <div>
      <h1>Add Employee</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={employeeData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={employeeData.surname}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={employeeData.age}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="idNumber"
          placeholder="ID Number"
          value={employeeData.idNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={employeeData.role}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          onChange={handlePhotoChange}
          required
        />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
