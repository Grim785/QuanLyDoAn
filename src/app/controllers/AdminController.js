const { where, Op } = require("sequelize");
const sequelize = require("../../config/db");
const initModels = require("../models/init-models");
// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
// Truy cập model
const { users, students, advisors, majors, class_, projects, projectstudents, projectadvisors} = models;
class AdminController{
    //[GET] /admin/dashboard
    dashboard(req, res, next){
        res.render('roles/admin/TopicDetails', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
            dashboardactive: true,
        });
    }
    //[GET] /admin/AccountManagement
    async AccountManagement(req, res, next){
        try {
            const listUsers = await users.findAll({
                include: [
                    {model: students, as: 'students', attributes: ['lastname','firstname']},
                    {model: advisors, as: 'advisors', attributes: ['lastname','firstname']}
                ],
                attributes: ['id','username', 'role', 'active', 'createdAt', 'updatedAt']
            });
            // console.log(JSON.stringify(listUsers, null, 2)); 
            res.render('roles/admin/AccountManagement', {
                title: 'Danh sách tài khoản',
                listUsers: listUsers,
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
            res.json(results);
        } catch (error) {
            console.log(error);
        }
    }
    async userDetail(req, res, next){
        try {
            const userId = req.params.id;
            const user = await users.findOne({
                where: { id: userId}
            });
            if (!user) {
                return res.status(404).render('error', { message: 'Tài khoản không tồn tại' });
            }

            if(user.role === 'student'){
                const student = await students.findOne({where: {usersID:userId}})
                res.render('roles/admin/detailStudent', { title: `Chi tiết sinh viên: ${user.username}`, student })
            }else if(user.role === 'advisor'){
                const advisor = await advisors.findOne({where: {userID:userId}})
                res.render('roles/admin/detailAdvisor', { title: `Chi tiết giảng viên: ${user.username}`, advisor })
            }
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
    async createToppic(req, res, next) {
        const data = req.body;
        const studentlist = Array.isArray(data['students[]']) ? data['students[]'] : [];
        const dateProject = new Date();
    
        const transaction = await sequelize.transaction();
        try {
            // Thêm dữ liệu vào bảng project
            const project = await projects.create({
                title: data.title,
                description: data.description,
                status: data.status,
                majorID: data.majorId,
                start_date: data.status === 'in_progress' ? dateProject : null
            }, { transaction });
    
            // Kiểm tra và thêm các sinh viên vào dự án
            for (const studentId of studentlist) {
                // Kiểm tra xem sinh viên đã tham gia dự án với trạng thái không hợp lệ chưa
                const existingProject = await projectstudents.findOne({
                    where: { student_id: studentId },
                    include: [{
                        model: projects,
                        as: 'project',
                        where: {
                            status: ['not_started', 'in_progress']
                        }
                    }]
                });
    
                if (existingProject) {
                    throw new Error(`Sinh viên ID ${studentId} đã tham gia một dự án khác với trạng thái not_started hoặc in_progress.`);
                }
    
                // Thêm sinh viên vào dự án
                await projectstudents.create({
                    project_id: project.id,
                    student_id: studentId
                }, { transaction });
            }
    
            // Thêm giảng viên hướng dẫn nếu có
            if (data.advisorId) {
                await projectadvisors.create({
                    project_id: project.id,
                    advisor_id: data.advisorId
                }, { transaction });
            }
    
            await transaction.commit();
            res.status(200).send({ message: 'Thêm thành công!' });
        } catch (error) {
            await transaction.rollback();
            console.error('Error creating project or students:', error);
            res.status(400).send({ message: error.message || 'Lỗi khi tạo dự án' });
        }
    }
    
    
}
module.exports = new AdminController();