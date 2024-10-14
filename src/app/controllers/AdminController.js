class AdminController{
    //[GET] /student/dashboard
    dashboard(req, res, next){
        res.render('admin/dashboard', {
            title: 'Dashboard admin',
        });
    }


    //[POST]

}
module.exports = new AdminController();