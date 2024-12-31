const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const s3 = require('../../config/aws');
require('dotenv').config();

const sequelize = require("../../config/db");
const initModels = require("../models/init-models");

// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
const { users, files, projectfiles } = models;

class SiteController {
    //[GET] /
    //---Giao diện đăng nhập --- /login
    login(req, res, next) {
        res.render('login', {
            title: 'Đăng nhập hệ thống',
            showHeaderFooter: false,
            showNav: false,
        });
    }
    //---Giao diện lỗi chưa đăng nhập--- /errlogin
    errlogin(req, res, next) {
        res.render('errlogin', {
            title: 'Err Login',
        });
    }
    //---Giao diện lỗi quyền truy cập /err403
    err403(req, res, next) {
        res.render('err403', {
            user: req.session.user,
            showHeaderFooter: false,
            showNav: false,
            title: 'Home',
            student: true,
        });
    }
    //---Chức năng đăng xuất /logout
    async logout(req, res, next) {
        try {
            req.session.destroy(err => {
                if (err) return next(err); // Xử lý lỗi nếu xảy ra
                res.clearCookie('userId'); // Xóa cookie
                res.redirect('/'); // Chuyển hướng sau khi đăng xuất
            });
        } catch (error) {
            next(error); // Xử lý lỗi nếu có
        }
    }
    //---Chức năng tìm kiếm sinh viên /student-search
    async searchStudents(req, res, next) {
        try {
            // Lấy query từ fontend -------------------
            const query = req.query.query;
            if (!query) {
                return res.status(400).json({ message: 'Yêu cầu tìm kiếm không hợp lệ' });
            }
            // Tìm sinh viên------------------------------------
            const results = await students.findAll({
                where: {
                    studentID: {
                        [Op.like]: `%${query}%`
                    }
                },
                attributes: ['id', 'studentID', 'lastname', 'firstname']
            });
            res.json(results);
        } catch (error) {
            console.log(error);
        }
    }
    //[POST] /
    //---Kiểm tra đăng nhập /chklogin
    async chklogin(req, res, next) {
        const { username, password, rememberMe } = req.body;
        try {
            const user = await users.findOne({ where: { username } });
            if (!user) {
                return res.status(400).send({ message: 'Tên đăng nhập hoặc mật khẩu không đúng, vui lòng kiểm tra lại!' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).send({ message: 'Tên đăng nhập hoặc mật khẩu không đúng, vui lòng kiểm tra lại!' });
            }

            req.session.user = user; // Lưu thông tin người dùng vào session
            global.userRole = { role: req.session.user.role };
            console.log("Thông tin: " + global.userRole.role);
            if (rememberMe) {
                res.cookie('userId', user.id, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // Cookie 7 ngày
            }
            res.status(200).send({ message: 'User login successfully', role: user.role });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    //---Tải file /upload/project
    async uploadFile(req, res) {
        try {
            const file = req.file;
            const projectId = req.body.projectId;
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const fileName = `${Date.now()}-${file.originalname}`;
            const fileContent = fs.readFileSync(file.path);
            const fileSize = file.size;

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName,
                Body: fileContent,
                ContentType: file.mimetype,
            };

            // Upload file lên S3
            const uploadResult = await s3.upload(params).promise();

            // Kiểm tra file đã tồn tại trong project
            const existingProjectFile = await projectfiles.findOne({
                where: { project_id: projectId },
                include: [{ model: files, as: 'file'}],
            });

            if (existingProjectFile) {
                // Xóa file cũ trên S3
                await s3.deleteObject({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: existingProjectFile.file.file_name,
                }).promise();

                // Cập nhật file mới trong bảng files
                await files.update(
                    {
                        file_name: fileName,
                        file_path: uploadResult.Location,
                        file_size: fileSize,
                        file_type: file.mimetype,
                    },
                    { where: { id: existingProjectFile.file_id } }
                );
            } else {
                // Tạo mới file trong bảng files
                const newFile = await files.create({
                    file_name: fileName,
                    file_path: uploadResult.Location,
                    uploaded_by: req.session.user.id,
                    file_size: fileSize,
                    file_type: file.mimetype,
                });

                // Tạo liên kết giữa project và file mới
                await projectfiles.create({
                    project_id: projectId,
                    file_id: newFile.id,
                });
            }

            // Xóa file tạm
            fs.unlink(file.path, (err) => {
                if (err) console.error('Error deleting temp file:', err);
            });

            // Trả về phản hồi thành công
            res.status(200).send('File uploaded successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('File upload failed');
        }
    }



    //[GET] /loadFile
    async loadFileproject(req, res, next) {
        try {
            const { project_id } = req.params;
            console.log(project_id);

            const projectFile = await projectfiles.findOne({
                where: { project_id },
                include: [{ model: files }],
            });

            if (projectFile) {
                res.status(200).json({ file: projectFile.file });
            } else {
                res.status(404).json({ message: 'No file found for this project' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to load file', error: error.message });
        }
    }
}

module.exports = new SiteController();
