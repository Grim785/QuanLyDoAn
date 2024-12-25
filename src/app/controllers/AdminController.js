const { where, Op } = require("sequelize");
const sequelize = require("../../config/db");
const initModels = require("../models/init-models");
// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
// Truy cập model
const { users, students, advisors, majors, class_, projects, projectstudents } = models;
class AdminController{
    //[GET] /student/dashboard
    dashboard(req, res, next){
        res.render('roles/admin/dashboard', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
            dashboardactive: true,
        });
    }

    AccountManagement(req, res, next){
        res.render('roles/admin/AccountManagement', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
            accountmanagementactive: true,
        });
    }

    AdvisorList(req, res, next){
        res.render('roles/admin/AdvisorList', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
            advisorlistactive: true,
        });
    }

    async createToppic(req, res, next){
        try {
            const major = await majors.findAll();
            const advisor = await advisors.findAll();

            res.render('roles/admin/create-new-topic', {
                title: 'Thêm mới đề tài',
                major: major,
                advisors: advisor,
                //Truyền dữ liệu hiển thị thành phần------
                showHeaderFooter: true,
                showNav: true,
                admin: true,
                //----------------------------------------
            });
        } catch (error) {
            console.log(error);
        }

    }

    async searchStudents(req, res, next){
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
            console.log('đã tới')
            res.json(results);
        } catch (error) {
            console.log(error);
        }
    }

    TopicList(req, res, next){
        res.render('roles/admin/TopicList', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
            topiclistactive: true,
        });
    }

    RegisterTopicList(req,res,next){
        res.render('roles/admin/RegisterTopicList', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
            registertopiclistactive: true,
        });
    }

    EditAccount(req, res, next) {
        res.render('roles/admin/EditAccount', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
            editaccountactive: true,
        });
    }

    //[POST]
}
module.exports = new AdminController();