const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const s3 = require('../../config/aws'); 
require('dotenv').config();

const sequelize = require("../../config/db");
const initModels = require("../models/init-models");
const { where } = require('sequelize');

// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
const { advisors, projectadvisors, projects, projectsregister, students, projectstudents } = models;

class AdvisorController {
//[GET] /advisor
    //---Giao diện danh sách duyệt đề tài
    async approveList(req, res, next) {
        const user_id = req.session.user.id;
        const role = req.session.user.role;
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
            res.render('roles/advisor/approve-topic-list', {
                title: 'Danh sách đề tài chờ duyệt',
                listRegiToppic: listToppic,
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
    //---Giao diện danh sách duyệt đề tài được phân công
    async assignedList(req, res, next) {
        const user_id = req.session.user.id;
        const role = req.session.user.role;
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
                            where: {status: 'in_progress'},
                            include: [
                                {
                                    model: projectsregister,
                                    as: 'projectsregister',
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
            res.render('roles/advisor/assigned-topic-list', {
                title: 'Danh sách đề tài hướng dẫn',
                listRegiToppic: listToppic,
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
//[POST] /advisor
    //---Duyệt chọn đề tài /approve-topic/:id
    async approveTopic(req, res, next){
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
    //---Từ chối chọn đề tài /reject-topic/:id
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
    //---Duyệt nhiều đề tài /approve-topics
    async approveMultipleTopics(req, res, next) {
        const { projectIds } = req.body; // Lấy danh sách ID các đề tài từ body
        try {
            const currentDate = new Date().toISOString().split('T')[0]; // Ngày hiện tại (YYYY-MM-DD)

            // Cập nhật trạng thái trong bảng `projects`
            const projectUpdate = await projects.update(
                { status: 'in_progress', start_date: currentDate },
                { where: { id: projectIds } } // Cập nhật cho nhiều ID
            );

            // Cập nhật trạng thái trong bảng `projectsregister`
            const registerUpdate = await projectsregister.update(
                { status: 'approved' },
                { where: { project_id: projectIds } } // Cập nhật cho nhiều ID
            );

            if (projectUpdate[0] === 0 || registerUpdate[0] === 0) {
                return res.status(404).json({ message: 'Không tìm thấy đề tài cần duyệt.' });
            }

            res.status(200).json({ message: 'Duyệt thành công tất cả các đề tài được chọn!' });
        } catch (error) {
            console.error('Lỗi khi duyệt nhiều đề tài:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi duyệt các đề tài.' });
        }
    }
    //---Hủy nhiều đề tài /reject-topics
    async rejectMultipleTopics(req, res, next) {
        const { projectIds, note } = req.body; // Lấy danh sách ID và lý do hủy từ body
        try {
            // Cập nhật trạng thái và lý do hủy trong bảng `projectsregister`
            const registerUpdate = await projectsregister.update(
                { status: 'rejected', note },
                { where: { project_id: projectIds } } // Cập nhật cho nhiều ID
            );

            if (registerUpdate[0] === 0) {
                return res.status(404).json({ message: 'Không tìm thấy đề tài cần hủy.' });
            }

            res.status(200).json({ message: 'Hủy thành công tất cả các đề tài được chọn!' });
        } catch (error) {
            console.error('Lỗi khi hủy nhiều đề tài:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi hủy các đề tài.' });
        }
    }

}
module.exports = new AdvisorController();