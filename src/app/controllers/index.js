// app/controllers/index.js
const AdminController = require('./AdminController');
const AdvisorController = require('./AdvisorController');
const siteControllers = require('./SiteController');
const studentController = require('./StudentController');
// Nếu có thêm controller khác, có thể import ở đây
// const otherController = require('./OtherController');

module.exports = {
  site: siteControllers,
  student: studentController,
  admin: AdminController,
  advisor: AdvisorController
  // other: otherController,
};

