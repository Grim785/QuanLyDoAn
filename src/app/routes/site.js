const express = require('express');
const router = express.Router();

const SiteController = require('../controllers/SiteController');
const { uploadProject, uploadAvatar, uploadExcel} = require('../../config/file');
const fileUpload = require('express-fileupload');



const uploadOpts = {
    useTempFiles: true,
    tempFileDir: './tmp/',
};



//[GET] /errlogin
router.get('/errlogin', SiteController.errlogin);
//[GET] /err403
router.get('/err403', SiteController.err403);
//[GET] /logout
router.get('/logout', SiteController.logout);
//[POST] /chklogin -- Kiểm tra đăng nhập
router.post('/chklogin', SiteController.chklogin);
//[POST] /upload/project --Tải đồ án lên cloud
router.post('/upload/project', uploadProject.single('file'), SiteController.uploadFile);
//[POST] /upload/avatar --Tải avatar lên cloud
router.post('/upload/avatar', uploadAvatar.single('file'), SiteController.uploadFile);
//[POST] /import-excel
router.post('/import-excel',uploadExcel.single('excel'),SiteController.importexcel);
//[GET] /
router.get('/',SiteController.login)


module.exports = router;