const bcrypt = require('bcrypt'); //Import mã hóa dữ liệu
const User = require("../models/User");

class LoginController {
    // [GET] /

    login(req, res, next) {
        res.render('login', {
            showHeaderFooter: false,
            showNav: false,
            title: 'Login',
        });
    }
    // [GET] /errlogin
    errlogin(req, res, next) {
        res.render('errlogin', {
            showHeaderFooter: false,
            showNav: false,
            title: 'Err Login',
        });
    }
    err403(req, res, next){
        console.log(req.session.user);
        res.render('err403', {
            user: req.session.user,
            showHeaderFooter: false,
            showNav: false,
            title: 'Home',
            student: true,
        });
    }

    // [POST] /chklogin

    async chklogin(req, res, next) {
        console.log(req.body);
        const { username, password, rememberMe } = req.body;

        // Xử lý đăng nhập
        try {
            // Tìm người dùng dựa trên username
            const user = await User.findOne({ where: { username } });
            // console.log(user);
            if (!user) {
                // Nếu không tìm thấy người dùng
                return res.status(200).send({ message: 'Tên đăng nhập hoặc mật khẩu không đúng, vui lòng kiểm tra lại!' });
            }

            // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong DB
            const isPasswordValid = await bcrypt.compare(password, user.password);
            // console.log(isPasswordValid);
            if (!isPasswordValid) {
                // Nếu mật khẩu không khớp
                return res.status(200).send({ message: 'Tên đăng nhập hoặc mật khẩu không đúng, vui lòng kiểm tra lại!' });
            }

            // Nếu đăng nhập thành công
            req.session.user = user; // Lưu thông tin người dùng vào session

            // Nếu người dùng chọn ghi nhớ đăng nhập
            if (rememberMe) {
                res.cookie('userId', user.id, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // Cookie tồn tại trong 7 ngày
            }
            res.status(200).send({ message: 'User login successfully', role: user.role });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new LoginController();