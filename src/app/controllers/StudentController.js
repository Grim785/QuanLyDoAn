class StudentController{
    //[GET] /student/dashboard
    dashboard(req, res, next){
        res.render('student/dashboard', {
            title: 'Dashboard student',
        });
    }


    //[POST]

}
module.exports = new StudentController();