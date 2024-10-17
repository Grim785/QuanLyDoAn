class StudentController{
    //[GET] /student/dashboard
    dashboard(req, res, next){
        res.render('student/dashboard', {
            title: 'Dashboard student',
            user: req.session.user,
            showHeaderFooter: true,
            showNav: true,
        });
    }
    //[GET] /student/registertopic
    registertopic(req, res, next){
        res.render('student/RegisterTopic', {
            title: 'registertopic student',
            showHeaderFooter: true,
            showNav: true,
        });
    }

    //[GET] /student/updateprocess
    updateprocess(req, res, next){
        res.render('student/UpdateProcess', {
            title: 'UpdateProcess',
            showHeaderFooter: true,
            showNav: true,
        });
    }

    //[GET] /student/AccountInfo
    accountinfo(req, res, next){
        res.render('student/AccountInfo', {
            title: 'AccountInfo',
            showHeaderFooter: true,
            showNav: true,
        });
    }
    //[POST]

}
module.exports = new StudentController();