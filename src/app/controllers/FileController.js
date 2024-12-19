// controllers/fileController.js
const s3 = require('../../config/aws');
const File = require('../models/file');
const path = require('path');
const fs = require('fs');

// Tải file lên S3 và lưu thông tin vào MySQL
const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const fileSize = file.size;
        console.log(fileSize);

        // Nếu không có file, trả lỗi
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileName = Date.now() + '-' + file.originalname;
        const filePath = path.join(__dirname, '..', 'public', 'uploads', fileName);

        // Đọc nội dung file
        const fileContent = fs.readFileSync(file.path);

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: fileContent,
            ContentType: file.mimetype,
        };

        // Upload lên S3
        const uploadResult = await s3.upload(params).promise();

        // Kiểm tra nếu đây là file avatar, nếu không thì là file dự án
        const isAvatar = req.body.is_avatar || 0;

        // Lưu thông tin file vào cơ sở dữ liệu MySQL
        const newFile = await File.create({
            file_name: file.originalname,
            file_path: uploadResult.Location,  // Đường dẫn file trên S3
            uploaded_by: req.session.user.id,  // ID người dùng tải lên
            file_size: fileSize,  // Kích thước file
            file_type: file.mimetype,  // Loại MIME của file
            is_avatar: isAvatar,  // Chỉ xác định là avatar nếu có
        });

        // Xóa file tạm thời sau khi upload
        fs.unlinkSync(file.path);

        res.json({ message: 'File uploaded successfully', file: newFile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'File upload failed' });
    }
};

module.exports = { uploadFile };
