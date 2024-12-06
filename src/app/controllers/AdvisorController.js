

class AdvisorController{
    //[GET] /advisor/dashboard
    dashboard(req, res, next){
        res.render('advisor/dashboard', {
            title: 'Dashboard advisor',
            showHeaderFooter: true,
            showNav: true,
            advisor: true,
        });
    }

    //[GET] /advisor/topic
    topic(req, res, next){
        res.render('advisor/Topic', {
            title: 'Topic advisor',
            showHeaderFooter: true,
            showNav: true,
            advisor: true,
        });
    }
    
    


    //[POST]

}
module.exports = new AdvisorController();