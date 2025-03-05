import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeList from './components/employeeList';
import AddEmployee from './components/add';
import EditEmployee from './components/edit';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<EmployeeList />} />
        <Route path="/add" element={<AddEmployee />} />
        <Route path="/edit/:id" element={<EditEmployee />} />
      </Routes>
    </Router>
  ); 
};

export default App;
