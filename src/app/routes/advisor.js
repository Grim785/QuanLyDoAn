const express = require('express');
const router = express.Router();

const AdvisorController = require('../controllers/AdvisorController');
const chkRoles = require('../../config/chkRoles');
//[GET] /advisor
    //---Giao diện danh sách duyệt đề tài
    router.get('/approve-topic-list', chkRoles('advisor'), AdvisorController.approveList);

//[POST] /advisor
    //---Duyệt chọn đề tài
    router.post('/approve-topic/:id', chkRoles('advisor'), AdvisorController.approveTopic);
    //---Từ chối chọn đề tài
    router.post('/reject-topic/:id', chkRoles('advisor'), AdvisorController.rejectTopic);
    // Duyệt nhiều đề tài
    router.post('/approve-topics', chkRoles('advisor'), AdvisorController.approveMultipleTopics);
    // Hủy nhiều đề tài
    router.post('/reject-topics', chkRoles('advisor'), AdvisorController.rejectMultipleTopics);

module.exports = router;    
