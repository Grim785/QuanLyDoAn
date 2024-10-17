class AdvisorController{
    //[GET] /advisor/dashboard
    dashboard(req, res, next){
        res.render('advisor/dashboard', {
            title: 'Dashboard advisor',
        });
    }

    //[GET] /advisor/topic
    topic(req, res, next){
        res.render('advisor/toppic', {
            title: 'Topic advisor',
        });
    }
    
    


    //[POST]

}
module.exports = new AdvisorController();