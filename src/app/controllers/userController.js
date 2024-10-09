const User = require('../models/userModels');

const createUser = async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            password: req.body.password, // Bạn nên mã hóa mật khẩu trước khi lưu
            role: req.body.role,
            email: req.body.email,
            full_name: req.body.full_name,
            phone_number: req.body.phone_number,
            date_of_birth: req.body.date_of_birth,
            address: req.body.address,
            position: req.body.position,
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('users', { users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Lấy theo thành phần
const getUsersBy = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['username', 'password', 'role']
        });
        res.render('users', { users: users.map(user => user.get({ plain: true })) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    // createUser,
    getUsers,
};
