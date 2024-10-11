const User = require("../models/userModel");

class SiteController{
    //[GET] /
    index(req, res, next){
        res.render('home', {
            showHeaderFooter: false
        });
    }
    login(req, res, next){
        res.render('login', {
            showHeaderFooter: false
        });
    }
    // async getUser(req, res, next){
    //     try{
    //         const user = await User.findAll();
    //         console.log(user);
    //         res.render('home', { user });
    //     }catch (error){
    //         next(error);
    //     }
    // }
    //[GET] /test
    test(req, res, next){
        res.render('test', {
            showHeaderFooter: false
        });
    }



    //[POST] 
    async testlogin(req, res, next) {
        const { uname, upass } = req.body;
        console.log(req.body);
        // Xử lý đăng nhập ở đây
        try {
            const user = await User.findOne({ where: { username: uname, password: upass } });
            if (user) {
                // Đăng nhập thành công
                // res.redirect('/home'); // Chuyển hướng đến trang chính
                res.send('Đăng nhập thành công');
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