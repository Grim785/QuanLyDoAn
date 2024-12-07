const { student } = require("./StudentController");
const User = require("../models/userModel");

class SiteController {
    //[GET] /
    index(req, res, next){
        res.render('student/dashboard', {
            showHeaderFooter: true,
            showNav: true,
            title: 'Home',
            student: true,
        });
    }
}
module.exports = new SiteController();
