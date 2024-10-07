const userModel = require('../models/userModel');

const getUsers = (req, res) => {
    userModel.getAllUsers((err, users) => {
        if (err) {
            return res.status(500).send('Error retrieving users');
        }
        res.render('users', { users });
    });
};

module.exports = {
    getUsers,
};
