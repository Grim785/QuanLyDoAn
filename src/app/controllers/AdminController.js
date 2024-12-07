class AdminController{
    //[GET] /student/dashboard
    dashboard(req, res, next){
        res.render('roles/admin/dashboard', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
        });
    }
    //[GET] /student/topicList
    topicList(req, res, next){
        res.render('roles/admin/TopicList', {
            title: 'TopicList admin',
            showHeaderFooter: true,
            showNav: true,
        });
    }


    //[POST]
}
module.exports = new AdminController();