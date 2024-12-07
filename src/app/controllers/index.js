const loginControllers = require('./LoginController');
const studentController = require('./StudentController');
const AdvisorController = require('./AdvisorController');
const AdminController = require('./AdminController');
// const otherController = require('./OtherController');

module.exports = {
  login: loginControllers,
  student: studentController,
  advisor: AdvisorController,
  admin: AdminController,
  
  // other: otherController,
};