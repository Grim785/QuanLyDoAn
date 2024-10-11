class LoginController{
    //[GET] /
    index(req, res, next){
        res.render('login');
    }
}
module.exports = new LoginController();