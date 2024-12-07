const User = require("../models/User");

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
    //[GET] /err

}
module.exports = new SiteController();
