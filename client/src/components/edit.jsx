import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmployee, updateEmployee } from '../services/api';

const EditEmployee = () => {
  const { id } = useParams(); 
  const [employeeData, setEmployeeData] = useState({
    name: '',
    surname: '',
    age: '',
    idNumber: '',
    role: '',
  });
  const [photo, setPhoto] = useState(null);
  const history = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await getEmployee(id);
        setEmployeeData(response.data);
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    fetchEmployee();
  }, [id]);

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
      await updateEmployee(id, employeeData);
      history.push('/');  // Redirect to employee list
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <div>
      <h1>Edit Employee</h1>
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
        />
        <button type="submit">Update Employee</button>
      </form>
    </div>
  );
};

export default EditEmployee;
