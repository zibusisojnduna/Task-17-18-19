import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EmployeeList from './components/employeeList';
import AddEmployee from './components/add';
import EditEmployee from './components/edit';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={EmployeeList} />
        <Route path="/add" component={AddEmployee} />
        <Route path="/edit/:id" component={EditEmployee} />
      </Switch>
    </Router>
  );
};

export default App;
