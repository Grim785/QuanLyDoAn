const express = require('express');
const router = express.Router();

const SiteController = require('../controllers/SiteController');
const { uploadProject, uploadAvatar} = require('../../config/file');


//[GET] /errlogin
router.get('/errlogin', SiteController.errlogin);
//[GET] /err403
router.get('/err403', SiteController.err403);
//[POST] /chklogin -- Kiểm tra đăng nhập
router.post('/chklogin', SiteController.chklogin);
//[POST] /upload/project --Tải đồ án lên cloud
router.post('/upload/project', uploadProject.single('file'), SiteController.uploadFile);
//[POST] /upload/avatar --Tải avatar lên cloud
router.post('/upload/avatar', uploadAvatar.single('file'), handleUpload, SiteController.uploadFile);


module.exports = router;