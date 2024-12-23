const bcrypt = require('bcrypt'); //Import mật khẩu
const User = require("../models/User");
const File = require("../models/File");
const path = require('path');
const fs = require('fs');
const s3 = require('../../config/aws'); // Import cấu hình AWS từ file config
require('dotenv').config();


class SiteController {
    // [GET] /
    login(req, res, next) {
        res.render('loginnew', {
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
    // [GET] /err403
    err403(req, res, next) {
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
    //[POST] /upload
    async uploadFile(req, res) {
        try {
            const file = req.file;
            const fileSize = file.size;
            console.log(fileSize);

            // Nếu không có file, trả lỗi
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const fileName = Date.now() + '-' + file.originalname; // Đổi tên file để tránh trùng lặp
            const filePath = path.join(__dirname, '..', 'public', 'uploads', fileName);

            // Đọc nội dung file
            const fileContent = fs.readFileSync(file.path);
            console.log(fileName + "ffffff");

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName,  // Tên file chứa thời gian để lưu giữ lịch sử
                Body: fileContent,
                ContentType: file.mimetype,
                // ACL: 'public-read',
            };

            // Upload file lên S3
            const uploadResult = await s3.upload(params).promise();

            // Kiểm tra xem người dùng có đã có file trước đó không
            const existingFile = await File.findOne({ where: { uploaded_by: req.session.user.id, is_avatar: req.body.is_avatar || 0 } });
            console.log(existingFile + "Kiểm tra tồn tại");

            if (existingFile) {
                // Nếu đã có file cũ, xóa file trên S3
                const deleteParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: existingFile.file_name,  // Tên file cũ đã lưu trong cơ sở dữ liệu
                };
                console.log(deleteParams + "Xóa file trùng");

                // Xóa file cũ trên S3
                await s3.deleteObject(deleteParams).promise();
                console.log('File deleted from S3:', existingFile.file_name);

                // Cập nhật bản ghi cũ trong cơ sở dữ liệu
                await File.update({
                    file_name: fileName,
                    file_path: uploadResult.Location,
                    file_size: fileSize,
                    file_type: file.mimetype,
                    is_avatar: req.body.is_avatar || 0,
                }, { where: { id: existingFile.id } });
                console.log('File record updated');
            } else {
                // Nếu không có file cũ, tạo mới một bản ghi
                const isAvatar = req.body.is_avatar || 0;
                const newFile = await File.create({
                    file_name: fileName,  // Lưu tên file mới với timestamp
                    file_path: uploadResult.Location,  // Đường dẫn file trên S3
                    uploaded_by: req.session.user.id,  // ID người dùng tải lên
                    file_size: fileSize,  // Kích thước file
                    file_type: file.mimetype,  // Loại MIME của file
                    is_avatar: isAvatar,  // Chỉ xác định là avatar nếu có
                });

                console.log('New file record created');
            }

            // Xóa file tạm sau khi upload
            fs.unlinkSync(file.path);

            // Trả về thông tin của file mới vừa upload
            res.json({ message: 'File uploaded successfully', file: uploadResult });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'File upload failed' });
        }
    }    
}
module.exports = new SiteController();
