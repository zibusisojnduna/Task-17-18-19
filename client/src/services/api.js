import axios from 'axios';

const API_URL = 'http://localhost:5000/api/employees';  // Change to your backend URL

export const addEmployee = (employeeData, photo) => {
  const formData = new FormData();
  formData.append('name', employeeData.name);
  formData.append('surname', employeeData.surname);
  formData.append('age', employeeData.age);
  formData.append('idNumber', employeeData.idNumber);
  formData.append('role', employeeData.role);
  formData.append('photo', photo);  // Add the file to FormData

  return axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',  // Needed for file upload
    },
  });
};

export const getEmployee = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const updateEmployee = (id, updatedData) => {
  return axios.put(`${API_URL}/${id}`, updatedData);
};

export const deleteEmployee = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export const searchEmployeeById = (id) => {
  return axios.get(`${API_URL}/search/${id}`);
};

export const getAllEmployees = () => {
  return axios.get(API_URL);
};
