const User = require("../models/User");

class LoginController{
// [GET] /

    login(req, res, next){
        res.render('login', {
            showHeaderFooter: false,
            showNav: false,
            title: 'Login',
        });
    }

// [POST] /chklogin

    async chklogin(req, res, next) {
        console.log(req.body);
        const { username, password, rememberMe } = req.body;
        
        // Xử lý đăng nhập
        try {
            const user = await User.findOne({ where: { username, password } });
            // console.log(user.role);
            if (user) {
                // Đăng nhập thành công
                req.session.user = user;  // Lưu thông tin người dùng vào session
                // console.log(user.role);
                //Nếu người dùng check vào ô ghi nhớ đăng nhập
                if (rememberMe) {
                    res.cookie('userId', user.id, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // Cookie tồn tại trong 7 ngày
                }
                res.status(200).send({ message: 'User login successfully', role: user.role });
                
            } else {
                res.status(200).send({ message: 'Tên đăng nhập hoặc mật khẩu không đúng, vui lòng kiểm tra lại!' });
            }
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new LoginController();