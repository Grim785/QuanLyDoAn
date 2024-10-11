// app/controllers/index.js
const siteControllers = require('./SiteController');
// Nếu có thêm controller khác, có thể import ở đây
// const otherController = require('./OtherController');

module.exports = {
  site: siteControllers,
  // other: otherController,
};

