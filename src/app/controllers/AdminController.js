const { where, Op } = require("sequelize");
const sequelize = require("../../config/db");
const initModels = require("../models/init-models");
// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
// Truy cập model
const { users, students, advisors, majors, class_, projects, projectstudents, projectadvisors} = models;
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

    async loadcreateToppic(req, res, next){
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

    //[POST] /admin/create-toppic
    async createToppic(req, res, next){
        // Lấy dữ liệu từ views
        const data= req.body;
        const studentlist = data['students[]'];
        const dateProject = new Date();
        // Transaction chặng lỗi
        const transaction = await sequelize.transaction();
        try {
            // Thêm dữ liệu vào bảng project
            const project = await projects.create({
                title: data.title,
                description: data.description,
                status: data.status,
                majorID: data.majorId,
                start_date: data.status === 'in_progress' ? dateProject : null
            });
            // Thêm các sinh viên vào các bảng
            for(const studentId of studentlist){
                await projectstudents.create({
                    project_id: project.id,
                    student_id: studentId
                });
            }
            //Thêm giảng viên hướng dẫn vào bảng
            if(data.advisorId != "")
            {
                const projectadvisor = await projectadvisors.create({
                    project_id: project.id,
                    advisor_id: data.advisorId
                }, {transaction})
            }
            await transaction.commit();
            res.status(200).send({message: 'Thêm thành công!'});
        } catch (error) {
            await transaction.rollback(); // Hoàn tác nếu có lỗi
            console.error('Error creating project or students:', error);
        }
    }
}
module.exports = new AdminController();