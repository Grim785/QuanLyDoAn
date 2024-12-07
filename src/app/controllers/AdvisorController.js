

class AdvisorController{
    //[GET] /advisor/dashboard
    dashboard(req, res, next){
        res.render('roles/advisor/dashboard', {
            title: 'Dashboard advisor',
            showHeaderFooter: true,
            showNav: true,
            advisor: true,
        });
    }

    //[GET] /advisor/topic
    topic(req, res, next){
        res.render('roles/advisor/Topic', {
            title: 'Topic advisor',
            showHeaderFooter: true,
            showNav: true,
            advisor: true,
        });
    }
    
    


    //[POST]

}
module.exports = new AdvisorController();