class AdvisorController{
    //[GET] /student/dashboard
    dashboard(req, res, next){
        res.render('advisor/dashboard', {
            title: 'Dashboard advisor',
        });
    }


    //[POST]

}
module.exports = new AdvisorController();