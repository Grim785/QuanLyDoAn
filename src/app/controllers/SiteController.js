const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const s3 = require('../../config/aws'); // Import AWS config
require('dotenv').config();

const sequelize = require("../../config/db");
const initModels = require("../models/init-models");

// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
const { users, files } = models; // Chỉ lấy những model cần thiết

const XLSX = require('xlsx');
class SiteController {
    // [GET] /login
    login(req, res, next) {
        res.render('loginnew', {
            title: 'Đăng nhập hệ thống',
            showHeaderFooter: false,
            showNav: false,
        });
    }

    // [GET] /errlogin
    errlogin(req, res, next) {
        res.render('errlogin', {
            title: 'Err Login',
        });
    }

    // [GET] /err403
    err403(req, res, next) {
        res.render('err403', {
            user: req.session.user,
            showHeaderFooter: false,
            showNav: false,
            title: 'Home',
            student: true,
        });
    }

    // [GET] /logout
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

    //[GET] /loadFile
    async loadFileproject(req, res, next){
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

    // [POST] /chklogin
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
            if (rememberMe) {
                res.cookie('userId', user.id, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // Cookie 7 ngày
            }
            res.status(200).send({ message: 'User login successfully', role: user.role });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // [POST] /upload
    async uploadFile(req, res) {
        try {
            const file = req.file;
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

            const existingFile = await files.findOne({
                where: { uploaded_by: req.session.user.id, is_avatar: req.body.is_avatar || 0 },
            });

            if (existingFile) {
                // Xóa file cũ trên S3
                await s3.deleteObject({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: existingFile.file_name,
                }).promise();

                // Cập nhật bản ghi
                await files.update(
                    {
                        file_name: fileName,
                        file_path: uploadResult.Location,
                        file_size: fileSize,
                        file_type: file.mimetype,
                        is_avatar: req.body.is_avatar || 0,
                    },
                    { where: { id: existingFile.id } }
                );
            } else {
                // Tạo bản ghi mới
                await files.create({
                    file_name: fileName,
                    file_path: uploadResult.Location,
                    uploaded_by: req.session.user.id,
                    file_size: fileSize,
                    file_type: file.mimetype,
                    is_avatar: req.body.is_avatar || 0,
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

    

    //[POST]
    async importexcel (req,res,next){
        try{
            const pagecur=req.body.pagecur;
            console.log("trang hiện tại:"+ pagecur);
            function formatToMySQLDate(date) {
                const d = new Date(date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0'); // Thêm 1 vì tháng bắt đầu từ 0
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            function convertExcelDate(excelTimestamp) {
                // Nếu không phải là số hợp lệ, trả về null (không hợp lệ)
                if (isNaN(excelTimestamp)) {
                    return null;
                }
            
                // Excel timestamp bắt đầu từ 1/1/1900
                const startDate = new Date(1900, 0, 1);
                const days = Math.floor(excelTimestamp) - 2; // Trừ 2 do lỗi Excel
                startDate.setDate(startDate.getDate() + days);
                
                return startDate;
            }
            
            // Hàm chuyển đổi ngày tháng thành định dạng 'YYYY-MM-DD HH:mm:ss'
            function formatToDateTime(date) {
                // Kiểm tra nếu date là đối tượng Date hợp lệ
                if (!(date instanceof Date) || isNaN(date.getTime())) {
                    return null; // Trả về null nếu không phải là ngày hợp lệ
                }
            
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
            
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            }

            if(req.file.mimetype!='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({msg:'file not invalid'});
            }
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const successData = [];
            const failureData = [];

            for(let i = 0; i<data.length; i++) {
                // excel sinh viên
                if(pagecur=="StudentManagement"){

                    const {id, studentID, lastname, firstname, date_of_birth, gender, address, majorsID, usersID, classID, createdAt = new Date(), updatedAt = new Date()} = data[i];
                    console.log({
                        id,
                        studentID,
                        lastname,
                        firstname,
                        date_of_birth,
                        gender,
                        address,
                        majorsID,
                        usersID,
                        classID,
                        createdAt,
                        updatedAt,
                    });

                    const formattedDateOfBirth = date_of_birth ? convertExcelDate(date_of_birth) : null;
                    const formattedSQLDateOfBirth = new Date(formattedDateOfBirth);
                    const formattedDateOfBirthSQL = formatToMySQLDate(formattedSQLDateOfBirth);
                    const formattedCreatedAt = createdAt ? formatToDateTime(createdAt) : null;
                    const formattedUpdatedAt = updatedAt ? formatToDateTime(updatedAt) : null;
                    const formattedStudentid = `${studentID}`;
                

                    const values = [
                        id || null,
                        formattedStudentid || null,
                        lastname || null,
                        firstname || null,
                        formattedDateOfBirthSQL,
                        gender || null,
                        address || null,
                        majorsID || null,
                        usersID || null,
                        classID || null,
                        formattedCreatedAt,
                        formattedUpdatedAt,
                    ];


                    const sql ='REPLACE INTO `students`(id, studentID, lastname, firstname, date_of_birth, gender, address, majorsID, usersID, classID, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    console.log('Câu lệnh SQL:', sql);
                    console.log('Tham số:', values);
                    const [rows] = await sequelize.query(sql, {
                        replacements: values
                    });
                    if (rows.affectedRows){
                        successData.push(data[i]);
                    }else{
                        failureData.push(data[i]);
                    }
                }

                
                // excel giảng viên
                if(pagecur=="AdvisorManagement")
                {
                    const {id, advisorID, lastname, firstname, date_of_birth, gender, address, userID, createdAt = new Date(), updatedAt = new Date()} = data[i];
                    console.log({
                        id,
                        advisorID,
                        lastname,
                        firstname,
                        date_of_birth,
                        gender,
                        address,
                        userID,
                        createdAt,
                        updatedAt,
                    });

                    const formattedDateOfBirth = date_of_birth ? convertExcelDate(date_of_birth) : null;
                    const formattedSQLDateOfBirth = new Date(formattedDateOfBirth);
                    const formattedDateOfBirthSQL = formatToMySQLDate(formattedSQLDateOfBirth);
                    const formattedCreatedAt = createdAt ? formatToDateTime(createdAt) : null;
                    const formattedUpdatedAt = updatedAt ? formatToDateTime(updatedAt) : null;
                    const formattedadvisorid = `${advisorID}`;
                

                    const values = [
                        id || null,
                        formattedadvisorid || null,
                        lastname || null,
                        firstname || null,
                        formattedDateOfBirthSQL,
                        gender || null,
                        address || null,
                        userID || null,
                        formattedCreatedAt,
                        formattedUpdatedAt,
                    ];


                    const sql ='REPLACE INTO `advisors`(id, advisorID, lastname, firstname, date_of_birth, gender, address, userID, createdAt, updatedAt) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    console.log('Câu lệnh SQL:', sql);
                    console.log('Tham số:', values);
                    const [rows] = await sequelize.query(sql, {
                        replacements: values
                    });
                    if (rows.affectedRows){
                        successData.push(data[i]);
                    }else{
                        failureData.push(data[i]);
                    }
                }
            }   
            fs.unlinkSync(req.file.path);
            return res.redirect(`/admin/${pagecur}`)
        }catch(error){
            console.error(error);
            res.status(500).send('Import excel failed');
        }
    }

}

module.exports = new SiteController();
