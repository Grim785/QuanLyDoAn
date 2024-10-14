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


    //[POST]

}
module.exports = new StudentController();