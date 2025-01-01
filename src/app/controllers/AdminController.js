const bcrypt = require('bcrypt'); //Import mã hóa mật khẩu
const { where, Op, Sequelize } = require("sequelize");
const sequelize = require("../../config/db");
const initModels = require("../models/init-models");
// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
// Truy cập model
const { users, students, advisors, majors, class_, projects, projectstudents, projectadvisors } = models;
class AdminController {
//[GET] /admin
    //---Giao diện quản lý sinh viên
    async studentManagement(req, res, next) {
        try {
            const role = req.session.user.role;
            const listStudent = await students.findAll({
                include: [
                    {
                        model: users,
                        as: 'user',
                        attributes: ['id', 'username']
                    },
                    {
                        model: class_,
                        as: 'class',
                        attributes: ['classID']
                    }
                ]

            })
            res.render('roles/admin/student-management', {
                title: 'Danh sách sinh viên',
                list: listStudent,
                //Truyền dữ liệu hiển thị thành phần------
                showHeaderFooter: true,
                showNav: true,
                role: role,
                //----------------------------------------
            });
        } catch (error) {
            console.log(error);
        }
    }
    //---Giao diện quản lý giảng viên
    async advisorManagement(req, res, next) {
        try {
            const role = req.session.user.role;
            const listAdvisors = await advisors.findAll({
                include: {
                    model: users,
                    as: 'user',
                    attributes: ['id', 'username']
                }
            })
            res.render('roles/admin/advisor-management', {
                title: 'Danh sách giảng viên',
                list: listAdvisors,
                //Truyền dữ liệu hiển thị thành phần------
                showHeaderFooter: true,
                showNav: true,
                role: role,
                //----------------------------------------
            });
        } catch (error) {
            console.log(error);
        }
    }
    //---Chức năng tìm kiếm bảng sinh viên
    async studentSearch(req, res, next) {
        try {
            const query = req.query.query || '';
            const results = await students.findAll({
                where: {
                    studentID: {
                        [Op.like]: `%${query}%`
                    }
                },
                include: [
                    {
                        model: users,
                        as: 'user'
                    },
                    {
                        model: class_,
                        as: 'class'
                    }
                ]
            })
            res.json(results);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình tìm kiếm' });
        }
    }
    //---Chức năng tìm kiếm giảng viên
    async advisorSearch(req, res, next) {
        try {
            const query = req.query.query || '';
            const results = await advisors.findAll({
                where: {
                    advisorID: {
                        [Op.like]: `%${query}%`
                    }
                },
                include: [
                    {
                        model: users,
                        as: 'user'
                    },
                ]
            })
            res.json(results);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình tìm kiếm' });
        }
    }
//[POST] /admin
    //---Chức năng thêm sinh viên mới
    async addStudent(req, res) {
        try {
            const {
                studentID,
                lastname,
                firstname,
                date_of_birth,
                gender,
                address,
                classID,
                username
            } = req.body;
            console.log("ngày sinh"+date_of_birth);

            // Kiểm tra dữ liệu đầu vào
            if (!studentID || !lastname || !firstname || !date_of_birth || !gender || !address || !classID || !username) {
                return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
            }

            // Kiểm tra trùng lặp studentID
            const existingStudent = await students.findOne({ where: { studentID } });
            if (existingStudent) {
                return res.status(409).json({ error: `Mã sinh viên ${studentID} đã tồn tại.` });
            }

            // Kiểm tra trùng lặp username
            const existingUser = await users.findOne({ where: { username } });
            if (existingUser) {
                return res.status(409).json({ error: `Tài khoản ${username} đã tồn tại.` });
            }

            // Tìm lớp học theo classID
            const classData = await class_.findOne({
                where: { classID },
                attributes: ['id', 'classID', 'status']
            });

            if (!classData) {
                return res.status(404).json({ error: `Không tìm thấy lớp học với mã ${classID}.` });
            }

            if (classData.status !== 'active') {
                return res.status(400).json({ error: `Lớp học ${classID} hiện không hoạt động.` });
            }

            // Tạo người dùng mới trong bảng users
            const hashedPassword = await bcrypt.hash('123', 10); // Mã hóa mật khẩu mặc định
            const user = await users.create({
                username,
                password: hashedPassword,
                role: 'student' // Đặt role mặc định là student
            });

            // Thêm sinh viên mới vào bảng students
            const student = await students.create({
                studentID,
                lastname,
                firstname,
                date_of_birth,
                gender,
                address,
                classID: classData.id, // Sử dụng id của lớp học từ bảng class_
                usersID: user.id // Liên kết với bảng users
            });

            res.status(201).json({ message: 'Thêm sinh viên thành công!', student });
        } catch (error) {
            console.error('Lỗi khi thêm sinh viên:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm sinh viên.' });
        }
    }
    //---Chức năng xóa sinh viên
    async deleteStudents(req, res) {
        try {
            const { ids } = req.body;

            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ error: 'Danh sách ID không hợp lệ.' });
            }

            // Tìm danh sách usersID liên kết với các sinh viên được chọn
            const studentRecords = await students.findAll({
                where: { id: ids },
                attributes: ['usersID'] // Chỉ lấy thông tin usersID
            });

            const userIDs = studentRecords.map((record) => record.usersID);

            // Xóa sinh viên từ danh sách ID
            await students.destroy({
                where: { id: ids }
            });

            // Xóa người dùng liên kết từ bảng users
            await users.destroy({
                where: { id: userIDs }
            });

            res.status(200).json({ message: 'Xóa sinh viên và tài khoản liên kết thành công!' });
        } catch (error) {
            console.error('Lỗi khi xóa sinh viên:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa sinh viên.' });
        }
    }
    //---Chức năng sửa thông tin sinh viên
    async updateStudents(req, res) {
        try {
            const { students: updatedStudents } = req.body;

            if (!updatedStudents || !Array.isArray(updatedStudents) || updatedStudents.length === 0) {
                return res.status(400).json({ error: 'Dữ liệu cập nhật không hợp lệ.' });
            }

            for (const studentData of updatedStudents) {
                const { id, studentID, username, classID, ...rest } = studentData;

                // Tìm sinh viên hiện tại
                const currentStudent = await students.findOne({ where: { id } });
                if (!currentStudent) {
                    return res.status(404).json({ error: `Không tìm thấy sinh viên với ID ${id}.` });
                }

                // Nếu studentID thay đổi, cập nhật username tương ứng
                if (currentStudent.studentID !== studentID) {
                    const newUsername = `${studentID}`;

                    // Kiểm tra xem username mới có bị trùng lặp không
                    const existingUser = await users.findOne({ where: { username: newUsername } });
                    if (existingUser) {
                        return res.status(409).json({ error: `Tài khoản ${newUsername} đã tồn tại.` });
                    }

                    // Cập nhật username trong bảng users
                    await users.update({ username: newUsername }, { where: { id: currentStudent.usersID } });
                }

                // Tìm lớp học theo mã classID
                const classData = await class_.findOne({ where: { classID } });
                if (!classData) {
                    return res.status(404).json({ error: `Không tìm thấy lớp học với mã ${classID}.` });
                }

                // Cập nhật thông tin sinh viên
                await students.update(
                    { studentID, classID: classData.id, ...rest },
                    { where: { id } }
                );
            }

            res.status(200).json({ message: 'Cập nhật sinh viên thành công!' });
        } catch (error) {
            console.error('Lỗi khi cập nhật sinh viên:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật sinh viên.' });
        }
    }
    //---Chức năng thêm giảng viên mới
    async addAdvisor(req, res) {
        try {
            const {
                advisorID,
                lastname,
                firstname,
                date_of_birth,
                gender,
                address,
                username
            } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!advisorID || !lastname || !firstname || !date_of_birth || !gender || !address || !username) {
                return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
            }

            // Kiểm tra trùng lặp studentID
            const existingStudent = await advisors.findOne({ where: { advisorID } });
            if (existingStudent) {
                return res.status(409).json({ error: `Mã giảng viên ${advisorID} đã tồn tại.` });
            }

            // Kiểm tra trùng lặp username
            const existingUser = await users.findOne({ where: { username } });
            if (existingUser) {
                return res.status(409).json({ error: `Tài khoản ${username} đã tồn tại.` });
            }

            // Tạo người dùng mới trong bảng users
            const hashedPassword = await bcrypt.hash('123', 10); // Mã hóa mật khẩu mặc định
            const user = await users.create({
                username,
                password: hashedPassword,
                role: 'advisor' // Đặt role mặc định là advisor
            });

            // Thêm sinh viên mới vào bảng students
            const advisor = await advisors.create({
                advisorID,
                lastname,
                firstname,
                date_of_birth,
                gender,
                address,
                userID: user.id // Liên kết với bảng users
            });

            res.status(201).json({ message: 'Thêm giảng viên thành công!', advisor });
        } catch (error) {
            console.error('Lỗi khi thêm giảng viên:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm giảng viên.' });
        }
    }
    //---Chức năng xóa giảng viên
    async deleteAdvisor(req, res) {
        try {
            const { ids } = req.body;

            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ error: 'Danh sách ID không hợp lệ.' });
            }

            // Tìm danh sách usersID liên kết với các sinh viên được chọn
            const studentRecords = await advisors.findAll({
                where: { id: ids },
                attributes: ['userID'] // Chỉ lấy thông tin usersID
            });

            const userIDs = studentRecords.map((record) => record.userID);

            // Xóa sinh viên từ danh sách ID
            await advisors.destroy({
                where: { id: ids }
            });

            // Xóa người dùng liên kết từ bảng users
            await users.destroy({
                where: { id: userIDs }
            });

            res.status(200).json({ message: 'Xóa giảng viên và tài khoản liên kết thành công!' });
        } catch (error) {
            console.error('Lỗi khi xóa giảng viên:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa giảng viên.' });
        }
    }
    //---Chức năng sửa thông tin sinh viên
    async updateAdvisor(req, res) {
        try {
            const { students: updatedStudents } = req.body;

            if (!updatedStudents || !Array.isArray(updatedStudents) || updatedStudents.length === 0) {
                return res.status(400).json({ error: 'Dữ liệu cập nhật không hợp lệ.' });
            }

            for (const studentData of updatedStudents) {
                const { id, advisorID, username, classID, ...rest } = studentData;

                // Tìm sinh viên hiện tại
                const currentStudent = await advisors.findOne({ where: { id } });
                if (!currentStudent) {
                    return res.status(404).json({ error: `Không tìm thấy giảng viên với ID ${id}.` });
                }

                // Nếu studentID thay đổi, cập nhật username tương ứng
                if (currentStudent.advisorID !== advisorID) {
                    const newUsername = `${advisorID}`;

                    // Kiểm tra xem username mới có bị trùng lặp không
                    const existingUser = await users.findOne({ where: { username: newUsername } });
                    if (existingUser) {
                        return res.status(409).json({ error: `Tài khoản ${newUsername} đã tồn tại.` });
                    }

                    // Cập nhật username trong bảng users
                    await users.update({ username: newUsername }, { where: { id: currentStudent.userID } });
                }

                // // Tìm lớp học theo mã classID
                // const classData = await class_.findOne({ where: { classID } });
                // if (!classData) {
                //     return res.status(404).json({ error: `Không tìm thấy lớp học với mã ${classID}.` });
                // }

                // Cập nhật thông tin sinh viên
                await advisors.update(
                    { advisorID, ...rest },
                    { where: { id } }
                );
            }

            res.status(200).json({ message: 'Cập nhật giảng viên thành công!' });
        } catch (error) {
            console.error('Lỗi khi cập nhật giảng viên:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật giảng viên.' });
        }
    }

    //[PUT] /admin
    //[DELETE] /admin



































}
module.exports = new AdminController();
