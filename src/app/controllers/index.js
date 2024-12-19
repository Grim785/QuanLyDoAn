const loginControllers = require('./LoginController');
const studentController = require('./StudentController');
const AdvisorController = require('./AdvisorController');
const AdminController = require('./AdminController');
const fileController = require('./fileController');
// const otherController = require('./OtherController');

module.exports = {
  student: studentController,
  advisor: AdvisorController,
  admin: AdminController,
  file: fileController,
  login: loginControllers,
  
  // other: otherController,
};