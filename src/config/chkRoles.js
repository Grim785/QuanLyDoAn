module.exports = (role) => {
    return (req, res, next) => {
        if (!req.session.user) {
            // Người dùng chưa đăng nhập
            // return res.status(401).send('Bạn cần đăng nhập để truy cập!');
            return res.redirect('/errlogin');
        }

        if (req.session.user.role !== role) {
            // Không có quyền truy cập
            // return res.status(403).send('Bạn không có quyền truy cập vào tài nguyên này!');
            return res.redirect('/err403');
        }

        // Vai trò hợp lệ
        next();
    };
};