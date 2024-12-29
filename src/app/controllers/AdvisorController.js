const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const s3 = require('../../config/aws'); // Import AWS config
require('dotenv').config();

const sequelize = require("../../config/db");
const initModels = require("../models/init-models");
const { where } = require('sequelize');

// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
const { advisors, projectadvisors, projects, projectsregister, students, projectstudents } = models; // Chỉ lấy những model cần thiết

class AdvisorController {
    //[GET] /advisor/dashboard
    async dashboard(req, res, next) {
        const user_id = req.session.user.id;
        try {
            const listToppic = await advisors.findAll({
                where: {userID: user_id},
                include: [{
                    model: projectadvisors,
                    as: 'projectadvisors',
                    include: [
                        {
                            model: projects,
                            as: 'project',
                            include: [
                                {
                                    model: projectsregister,
                                    as: 'projectsregister',
                                    where: {status: 'pending'}
                                },
                                {
                                    model: projectstudents,
                                    as: 'projectstudents',
                                    include: [
                                        {
                                            model: students,
                                            as: 'student'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }]
            });
            // Kết quả JSON sạch
            console.log(JSON.stringify(listToppic, null, 2));
            res.render('roles/advisor/dashboard', {
                title: 'Dashboard advisor',
                listRegiToppic: listToppic,
                //Truyền dữ liệu hiển thị thành phần------
                showHeaderFooter: true,
                showNav: true,
                advisor: true,
                //----------------------------------------
            });
        } catch (error) {
            console.log(error);
        }

    }

    //[GET] /advisor/topic
    topic(req, res, next) {
        res.render('roles/advisor/Topic', {
            title: 'Topic advisor',
            showHeaderFooter: true,
            showNav: true,
            advisor: true,
        });
    }

    //[POST]
    async approveToppic(req, res, next){
        const projectId = req.params.id;
        try {
            const currentDate = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại (YYYY-MM-DD)
            // Cập nhật trạng thái trong bảng `projects`
            const projectUpdate = await projects.update(
                { status: 'in_progress', start_date: currentDate },
                { where: { id: projectId } }
            );
            // Cập nhật trạng thái trong bảng `projectsregister`
            const registerUpdate = await projectsregister.update(
                { status: 'approved' },
                { where: { project_id: projectId } }
            );
    
            if (projectUpdate[0] === 0 || registerUpdate[0] === 0) {
                return res.status(404).json({ message: 'Không tìm thấy đề tài cần duyệt.' });
            }
    
            res.status(200).json({ message: 'Duyệt đề tài thành công!' });
        } catch (error) {
            console.error('Lỗi khi duyệt đề tài:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi duyệt đề tài.' });
        }
    }

    async rejectTopic (req, res, next) {
        const projectId = req.params.id;
        const { note } = req.body; // Lấy lý do hủy từ body
    
        try {
            // Cập nhật trạng thái và lý do hủy trong bảng `projectsregister`
            const registerUpdate = await projectsregister.update(
                { status: 'rejected', note },
                { where: { project_id: projectId } }
            );
    
            if (registerUpdate[0] === 0) {
                return res.status(404).json({ message: 'Không tìm thấy đề tài cần hủy.' });
            }
    
            res.status(200).json({ message: 'Hủy đề tài thành công!' });
        } catch (error) {
            console.error('Lỗi khi hủy đề tài:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi hủy đề tài.' });
        }
    }
}
module.exports = new AdvisorController();