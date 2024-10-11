// app/controllers/index.js
const siteControllers = require('./SiteController');
const loginControllers = require('./LoginController');
// Nếu có thêm controller khác, có thể import ở đây
// const otherController = require('./OtherController');

module.exports = {
  login: loginControllers,
  site: siteControllers,
  // other: otherController,
};

