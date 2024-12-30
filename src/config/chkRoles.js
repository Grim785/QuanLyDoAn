module.exports = (role) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/errlogin'); //---Trả lỗi nếu chưa đăng nhập
        }
        
        if (role !== '') {
            if(req.session.user.role !== role)
            {
                return res.redirect('/err403'); //---Trả lỗi nếu truy cập trái phép
            }
        }
        next();
    };
};