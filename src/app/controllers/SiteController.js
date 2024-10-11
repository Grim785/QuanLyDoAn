const User = require("../models/userModel");

class SiteController{
    //[GET] /
    index(req, res, next){
        res.render('home', {
            showHeaderFooter: true,
            title: 'Home',
        });
    }
    //[GET] /login
    login(req, res, next){
        res.render('login', {
            showHeaderFooter: false,
            showNav: false,
            title: 'Login',
        });
    }
    // //[GET] /test
    // test(req, res, next){
    //     res.render('test', {
    //         showHeaderFooter: false
    //     });
    // }



    //[POST] /login
    async chklogin(req, res, next) {
        const { username, password, rememberMe } = req.body;
        console.log(req.body);
        // Xử lý đăng nhập
        try {
            const user = await User.findOne({ where: { username, password} });
            if (user) {
                // Đăng nhập thành công
                req.session.user = user;  // Lưu thông tin người dùng vào session
                //Nếu người dùng check vào ô ghi nhớ đăng nhập
                if (rememberMe) {
                    res.cookie('userId', user.id, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // Cookie tồn tại trong 7 ngày
                }
                
                // res.send('Đăng nhập thành công');
                res.redirect('/');
            } else {
                // Đăng nhập thất bại
                res.send('Đăng nhập thất bại');
                // res.render('login', {
                //     title: 'Login',
                //     error: 'Tên đăng nhập hoặc mật khẩu không chính xác.'
                // });
            }
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new SiteController();