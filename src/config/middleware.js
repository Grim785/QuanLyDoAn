const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer'); // Import Multer
const s3 = require('./aws'); // Import cấu hình AWS từ file config
require('dotenv').config();

module.exports = (app) => {
    let yourSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
    if (!yourSecretKey) {
        yourSecretKey = crypto.randomBytes(32).toString('hex');
        fs.appendFileSync('.env', `SECRET_KEY=${yourSecretKey}\n`, 'utf8');
    }

    console.log('Secret Key saved to .env:', yourSecretKey);

    // Cấu hình Multer (middleware để xử lý file upload)
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'src/public/uploads'); // Lưu trữ file vào thư mục 'public/uploads'
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname); // Đặt tên file với timestamp
        },
    });

    // Middleware cho file upload dự án (chỉ cho phép file nén)
    const uploadProject = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            // Kiểm tra phần mở rộng của file
            const fileTypes = /zip|tar|rar|gz|7z/;
            const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

            if (extname) {
                return cb(null, true); // Cho phép file nếu phần mở rộng đúng
            } else {
                cb(new Error('Only compressed files are allowed!'), false); // Nếu không phải file nén thì từ chối
            }
        },
    });

    // Middleware cho file upload avatar (chỉ cho phép file hình ảnh)
    const uploadAvatar = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            const fileTypes = /jpg|jpeg|png|gif/;
            const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = fileTypes.test(file.mimetype);

            if (extname && mimetype) {
                return cb(null, true); // Cho phép tải lên
            } else {
                cb(new Error('Only image files are allowed!'), false); // Nếu không phải file hình ảnh
            }
        },
    });

    // Middleware xử lý sau khi tải file
    const handleUpload = async (req, res, next) => {
        const uploadedFile = req.file; // File đã được tải lên
        if (!uploadedFile) {
            return next(new Error('File upload failed!'));
        }

        // Lấy thông tin file
        const filePath = uploadedFile.path;
        const fileName = uploadedFile.filename;
        const fileType = uploadedFile.mimetype;

        console.log('File uploaded successfully:', filePath);

        // Cấu hình S3 upload
        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME, // Tên bucket của bạn
            Key: `${Date.now()}-${fileName}`, // Đặt tên file trên S3 với timestamp
            Body: fs.createReadStream(filePath), // Đọc file từ local
            ContentType: fileType,
            // ACL: 'public-read', // Quyền truy cập file (có thể là private hoặc public)
        };

        try {
            // Upload file lên S3
            const s3Response = await s3.upload(s3Params).promise();

            // Lưu lại URL của file trên S3 (s3Response.Location)
            console.log('File uploaded to S3:', s3Response.Location);

            // Xóa file tạm sau khi upload lên S3
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Failed to delete temporary file:', err);
                } else {
                    console.log('Temporary file deleted successfully');
                }
            });

            // Lưu thông tin vào cơ sở dữ liệu (nếu cần)

            req.file.s3Location = s3Response.Location; // Thêm đường dẫn file S3 vào request để sử dụng sau
            next();
        } catch (error) {
            console.error('Error uploading to S3:', error);
            next(error); // Chuyển lỗi cho middleware tiếp theo
        }
    };

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(
        session({
            secret: yourSecretKey,
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 24 * 60 * 60 * 1000 },
        })
    );

    // Sử dụng middleware cho trang upload dự án (chỉ cho phép file nén)
    app.post('/student/upload/project', uploadProject.single('file'), handleUpload, (req, res) => {
        res.send('Project file uploaded and temporary file removed.');
    });

    // Sử dụng middleware cho trang upload avatar (chỉ cho phép hình ảnh)
    app.post('/files/upload/avatar', uploadAvatar.single('file'), handleUpload, (req, res) => {
        // Sử dụng req.file.s3Location để lấy URL của file trên S3
        const avatarUrl = req.file.s3Location;
        res.send(`Avatar uploaded successfully. File URL: ${avatarUrl}`);
    });
};
