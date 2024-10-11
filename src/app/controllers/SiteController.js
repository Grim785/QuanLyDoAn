const User = require("../models/userModel");

class SiteController{
    //[GET] /
    index(req, res, next){
        res.render('login', {
            showHeaderFooter: false
        });
    }
    async getUser(req, res, next){
        try{
            const user = await User.findAll();
            console.log(user);
            res.render('home', { user });
        }catch (error){
            next(error);
        }
    }
}
module.exports = new SiteController();