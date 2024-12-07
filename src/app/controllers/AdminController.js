

class AdminController{
    //[GET] /student/dashboard
    dashboard(req, res, next){
        res.render('roles/admin/dashboard', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
        });
    }

    AccountManagement(req, res, next){
        res.render('roles/admin/AccountManagement', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
        });
    }

    AdvisorList(req, res, next){
        res.render('roles/admin/AdvisorList', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
        });
    }

    TopicList(req, res, next){
        res.render('roles/admin/TopicList', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
        });
    }

    //[POST]
}
module.exports = new AdminController();