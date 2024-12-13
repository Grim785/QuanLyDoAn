const loginControllers = require('./LoginController');
const studentController = require('./StudentController');
const AdvisorController = require('./AdvisorController');
const AdminController = require('./AdminController');
// const otherController = require('./OtherController');

module.exports = {
  student: studentController,
  advisor: AdvisorController,
  admin: AdminController,
  login: loginControllers,
  
  // other: otherController,
};