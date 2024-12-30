const bcrypt = require('bcrypt'); //Import mã hóa mật khẩu
const { where, Op } = require("sequelize");
const sequelize = require("../../config/db");
const initModels = require("../models/init-models");
// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
// Truy cập model
const { users, students, advisors, majors, class_, projects, projectstudents, projectadvisors } = models;
class AdminController {
//[GET] /admin
    //---Giao diện quản lý sinh viên
    async studentManagement(req, res, next) {
        try {
            const role = req.session.user.role;
            const listStudent = await students.findAll({
                include: [
                    {
                        model: users,
                        as: 'user',
                        attributes: ['id', 'username']
                    },
                    {
                        model: class_,
                        as: 'class',
                        attributes: ['classID']
                    }
                ]

            })
            res.render('roles/admin/student-management', {
                title: 'Danh sách sinh viên',
                list: listStudent,
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
    //---Giao diện quản lý giảng viên
    async advisorManagement(req, res, next) {
        try {
            const role = req.session.user.role;
            const listAdvisors = await advisors.findAll({
                include: {
                    model: users,
                    as: 'user',
                    attributes: ['id', 'username']
                }
            })
            res.render('roles/admin/advisor-management', {
                title: 'Danh sách giảng viên',
                list: listAdvisors,
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
    //---Chức năng tìm kiếm bảng sinh viên
    async studentSearch(req, res, next) {
        const query = req.query.query || '';
        try {
            const whereClause = query
                ? {
                    [Sequelize.Op.or]: [
                        { studentID: { [Sequelize.Op.like]: `%${query}%` } },
                        { lastname: { [Sequelize.Op.like]: `%${query}%` } },
                        { firstname: { [Sequelize.Op.like]: `%${query}%` } },
                    ],
                }
                : {}; // Không áp dụng bộ lọc nếu query rỗng

            const filteredStudents = await students.findAll({
                where: whereClause,
                include: [
                    {
                        model: users,
                        as: 'user',
                        attributes: ['id', 'username'],
                    },
                    {
                        model: class_,
                        as: 'class',
                        attributes: ['classID'],
                    },
                ],
            });
            res.status(200).json(filteredStudents);
        } catch (error) {
            console.error('Error searching students:', error);
            res.status(500).json({ message: 'Lỗi khi tìm kiếm sinh viên' });
        }
    }
    //[POST] /admin
    //[PUT] /admin
    //[DELETE] /admin


    //[GET] /admin/AccountManagement
    async AccountManagement(req, res, next) {
        try {
            const listUsers = await users.findAll({
                include: [
                    { model: students, as: 'students', attributes: ['lastname', 'firstname'] },
                    { model: advisors, as: 'advisors', attributes: ['lastname', 'firstname'] }
                ],
                attributes: ['id', 'username', 'role', 'active', 'createdAt', 'updatedAt']
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
    //[GET] /admin/AdvisorManagement

    //[GET] /admin/StudentManagement

    // [POST] /admin/addRecord
    async addAdvisor(req, res, next) {
        try {
            const { advisorID, lastname, firstname, date_of_birth, gender, address, username } = req.body;


            // Kiểm tra trùng lặp advisorID
            const existingAdvisor = await advisors.findOne({ where: { advisorID } });
            if (existingAdvisor) {
                return res.status(400).json({ message: 'Mã giảng viên đã tồn tại trong hệ thống.' });
            }

            // Kiểm tra trùng lặp username
            const existingUser = await users.findOne({ where: { username } });
            if (!existingUser) {
                return res.status(400).json({ message: 'Tài khoản liên kết không tồn tại.' });
            }

            // Kiểm tra userID đã liên kết ở bảng advisors hoặc students
            const linkedAdvisor = await advisors.findOne({ where: { userID: existingUser.id } });
            const linkedStudent = await students.findOne({ where: { usersID: existingUser.id } });

            if (linkedAdvisor || linkedStudent) {
                return res.status(400).json({ message: 'Tài khoản này đã được liên kết với một người dùng khác.' });
            }

            // Cập nhật vai trò của user thành 'advisor'
            await existingUser.update({ role: 'advisor' });

            const newAdvisor = await advisors.create({
                advisorID,
                lastname,
                firstname,
                date_of_birth,
                gender,
                address,
                userID: existingUser.id
            });

            res.status(201).json({ message: 'Thêm giảng viên thành công!', advisor: newAdvisor });
        } catch (error) {
            console.log(error);
            res.status(500).send('Lỗi khi thêm giảng viên.');
        }
    }

    // [POST] /admin/addRecord
    async addStudent(req, res, next) {
        try {
            const { studentID, lastname, firstname, date_of_birth, gender, address, classID, username } = req.body;

            // Kiểm tra trùng lặp advisorID
            const existingStudent = await students.findOne({ where: { studentID } });
            if (existingStudent) {
                return res.status(400).json({ message: 'Mã sinh viên đã tồn tại trong hệ thống.' });
            }

            // Kiểm tra trùng lặp username
            const existingUser = await users.findOne({ where: { username } });
            if (!existingUser) {
                return res.status(400).json({ message: 'Tài khoản liên kết không tồn tại.' });
            }

            // Kiểm tra userID đã liên kết ở bảng advisors hoặc students
            const linkedAdvisor = await advisors.findOne({ where: { userID: existingUser.id } });
            const linkedStudent = await students.findOne({ where: { usersID: existingUser.id } });

            if (linkedAdvisor || linkedStudent) {
                return res.status(400).json({ message: 'Tài khoản này đã được liên kết với một người dùng khác.' });
            }

            // Cập nhật vai trò của user thành 'advisor'
            await existingUser.update({ role: 'student' });

            // Kiểm tra tồn tại classID
            const existingClass = await class_.findOne({ where: { classID: classID } });
            if (!existingClass) {
                return res.status(400).json({ message: 'Lớp học không tồn tại.' });
            }

            const newStudent = await students.create({
                studentID,
                lastname,
                firstname,
                date_of_birth,
                gender,
                classID: existingClass.id,
                address,
                usersID: existingUser.id
            });

            res.status(201).json({ message: 'Thêm sinh viên thành công!', student: newStudent });
        } catch (error) {
            console.log(error);
            res.status(500).send('Lỗi khi thêm sinh viên.');
        }
    }

    // [DELETE] /admin/AdvisorManagement/delete/:id
    async deleteAdvisor(req, res, next) {
        try {
            const { id } = req.params;
            const advisor = await advisors.findByPk(id);

            if (!advisor) {
                return res.status(404).send('Giảng viên không tồn tại.');
            }

            await advisor.destroy();

            res.status(200).json({ message: 'Xóa giảng viên thành công!' });
        } catch (error) {
            console.log(error);
            res.status(500).send('Lỗi khi xóa giảng viên.');
        }
    }
    // [DELETE] /admin/AdvisorManagement/delete/:id
    async deleteStudent(req, res, next) {
        try {
            const { id } = req.params;
            const student = await students.findByPk(id);

            if (!student) {
                return res.status(404).send('Sinh viên không tồn tại.');
            }

            await student.destroy();

            res.status(200).json({ message: 'Xóa sinh viên thành công!' });
        } catch (error) {
            console.log(error);
            res.status(500).send('Lỗi khi xóa sinh viên.');
        }
    }

    // [PUT] /admin/AdvisorManagement/update/:id
    async updateAdvisor(req, res, next) {
        try {
            const { id } = req.params;
            const { advisorID, lastname, firstname, date_of_birth, gender, address, username } = req.body;
            const advisor = await advisors.findByPk(id);

            if (!advisor) {
                return res.status(404).send('Giảng viên không tồn tại.');
            }

            // Kiểm tra trùng lặp advisorID nếu thay đổi
            if (advisor.advisorID !== advisorID) {
                const existingAdvisor = await advisors.findOne({ where: { advisorID } });
                if (existingAdvisor) {
                    return res.status(400).json({ message: 'Mã giảng viên đã tồn tại trong hệ thống.' });
                }
            }

            // Kiểm tra trùng lặp username nếu thay đổi
            const existingUser = await users.findOne({ where: { username } });
            if (!existingUser) {
                return res.status(400).json({ message: 'Tài khoản liên kết không tồn tại.' });
            }

            // Kiểm tra userID đã liên kết ở bảng advisors hoặc students nếu thay đổi
            if (advisor.userID !== existingUser.id) {
                const linkedAdvisor = await advisors.findOne({ where: { userID: existingUser.id } });
                const linkedStudent = await students.findOne({ where: { usersID: existingUser.id } });

                if (linkedAdvisor || linkedStudent) {
                    return res.status(400).json({ message: 'Tài khoản này đã được liên kết với một người dùng khác.' });
                }
            }

            // Cập nhật vai trò của user thành 'advisor' nếu chưa đúng
            if (existingUser.role !== 'advisor') {
                await existingUser.update({ role: 'advisor' });
            }

            await advisor.update({
                advisorID,
                lastname,
                firstname,
                date_of_birth,
                gender,
                address,
                userID: existingUser.id
            });

            res.status(200).json({ message: 'Cập nhật giảng viên thành công!' });
        } catch (error) {
            console.log(error);
            res.status(500).send('Lỗi khi cập nhật giảng viên.');
        }
    }
    // [PUT] /admin/StudentManagement/update/:id
    async updateStudent(req, res, next) {
        try {
            const { id } = req.params;
            const { studentID, lastname, firstname, date_of_birth, gender, address, classID, username } = req.body;

            const student = await students.findByPk(id);
            if (!student) {
                return res.status(404).json({ message: 'Sinh viên không tồn tại.' });
            }

            // Kiểm tra và xử lý thay đổi studentID
            if (student.studentID !== studentID) {
                const existingStudent = await students.findOne({ where: { studentID } });
                if (existingStudent) {
                    return res.status(400).json({ message: 'Mã sinh viên đã tồn tại trong hệ thống.' });
                }
            }

            // Kiểm tra và xử lý thay đổi classID
            const existingClass = await class_.findOne({ where: { classID } });
            if (!existingClass) {
                return res.status(400).json({ message: 'Lớp học không tồn tại.' });
            }

            // Kiểm tra và xử lý thay đổi username
            let existingUser = await users.findOne({ where: { id: student.usersID } });
            if (!existingUser) {
                return res.status(400).json({ message: 'Tài khoản liên kết không tồn tại.' });
            }

            if (existingUser.username !== username) {
                const newUser = await users.findOne({ where: { username } });
                if (!newUser) {
                    return res.status(400).json({ message: 'Tài khoản liên kết mới không tồn tại.' });
                }

                // Kiểm tra xem tài khoản mới có liên kết với người dùng khác không
                const linkedAdvisor = await advisors.findOne({ where: { userID: newUser.id } });
                const linkedStudent = await students.findOne({ where: { usersID: newUser.id } });

                if (linkedAdvisor || linkedStudent) {
                    return res.status(400).json({ message: 'Tài khoản mới đã được liên kết với người dùng khác.' });
                }

                existingUser = newUser;
            }

            // So sánh dữ liệu hiện tại với dữ liệu mới
            if (
                student.studentID === studentID &&
                student.lastname === lastname &&
                student.firstname === firstname &&
                student.date_of_birth === date_of_birth &&
                student.gender === gender &&
                student.address === address &&
                student.classID === existingClass.id &&
                student.usersID === existingUser.id
            ) {
                return res.status(200).json({ message: 'Không có thay đổi để cập nhật.' });
            }

            // Cập nhật vai trò của user thành 'student' nếu cần
            if (existingUser.role !== 'student') {
                await existingUser.update({ role: 'student' });
            }

            // Cập nhật thông tin sinh viên
            await student.update({
                studentID,
                lastname,
                firstname,
                date_of_birth,
                gender,
                address,
                classID: existingClass.id,
                usersID: existingUser.id,
            });

            res.status(200).json({ message: 'Cập nhật sinh viên thành công!' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi khi cập nhật sinh viên.');
        }
    }





















    AdvisorList(req, res, next) {
        res.render('roles/admin/AdvisorList', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
            advisorlistactive: true,
        });
    }

    async loadcreateToppic(req, res, next) {
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
    async searchStudents(req, res, next) {
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
    async userDetail(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await users.findOne({
                where: { id: userId }
            });
            if (!user) {
                return res.status(404).render('error', { message: 'Tài khoản không tồn tại' });
            }

            if (user.role === 'student') {
                const student = await students.findOne({ where: { usersID: userId } })
                res.render('roles/admin/detailStudent', {
                    title: `Chi tiết sinh viên: ${user.username}`,
                    student
                });
            } else if (user.role === 'advisor') {
                const advisor = await advisors.findOne({ where: { userID: userId } })
                res.render('roles/admin/detailAdvisor', {
                    title: `Chi tiết giảng viên: ${user.username}`,
                    advisor
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    async updateAccount(req, res, next) {
        const userId = req.params.id;
        const updatedData = req.body;

        try {
            // Kiểm tra nếu username đã thay đổi
            if (updatedData.username) {
                // Kiểm tra xem username đã tồn tại chưa (ngoại trừ người dùng hiện tại)
                const existingUser = await users.findOne({
                    where: {
                        username: updatedData.username,
                        id: { [Op.ne]: userId }, // Kiểm tra ngoại trừ user hiện tại
                    }
                });

                if (existingUser) {
                    return res.status(400).json({ success: false, message: 'Username đã tồn tại' });
                }
            }

            // Nếu không có lỗi về username, tiến hành cập nhật thông tin người dùng
            await users.update(updatedData, { where: { id: userId } });
            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    }

    async addAccount(req, res, next) {
        const { username, password, role } = req.body;
        try {
            if (!username || !password || !role) {
                return res.status(400).json({ success: false, message: 'Thiếu thông tin cần thiết!' });
            }
            const existingUser = await users.findOne({ where: { username } });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Tên tài khoản đã tồn tại!' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await users.create({
                username: username,
                password: hashedPassword,
                role: role,
                active: true,
            });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi!' });
        }
    }
    async deleteAccount(req, res, next) {
        const { id } = req.params;
        try {
            const user = await users.findByPk(id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại!' });
            }
            await user.destroy();
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi!' });
        }
    }





    RegisterTopicList(req, res, next) {
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
        console.log('Data received:', data);

        const studentlist = Array.isArray(data.students) ? data.students : [];
        console.log(studentlist);
        const dateProject = new Date();

        const transaction = await sequelize.transaction();
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!data.title || !data.description || !data.status || !data.majorId) {
                throw new Error('Thiếu thông tin bắt buộc');
            }

            // Thêm dữ liệu vào bảng project
            const project = await projects.create({
                title: data.title,
                description: data.description,
                status: data.status,
                majorID: data.majorId,
                start_date: data.status === 'in_progress' ? dateProject : null
            }, { transaction });

            try {
                for (const studentId of studentlist) {
                    const existingProject = await projectstudents.findOne({
                        where: { student_id: studentId },
                        include: [
                            {
                                model: projects,
                                as: 'project',
                                where: {
                                    status: ['not_started', 'in_progress'],
                                },
                            },
                            {
                                model: students,
                                as: 'student',
                                where: {
                                    id: studentId,  // So khớp với student_id
                                },
                                attributes: ['studentID', 'lastname', 'firstname'], // Lấy những trường cần thiết
                            },
                        ],
                    });

                    console.log(existingProject);

                    if (existingProject) {
                        // Nếu sinh viên đã tham gia dự án khác với trạng thái not_started hoặc in_progress
                        const { studentID, lastname, firstname } = existingProject.student;
                        res.status(400).send({ message: `Sinh viên ${studentID} - ${lastname} ${firstname} đã tham gia một dự án khác. Vui lòng kiểm tra lại!` });
                        return; // Dừng quá trình nếu có lỗi
                    }

                    // Nếu không có lỗi, tiếp tục thêm sinh viên vào dự án
                    await projectstudents.create({
                        project_id: project.id,
                        student_id: studentId,
                    }, { transaction });
                }
            } catch (error) {
                console.error('Lỗi khi xử lý sinh viên:', error.message);
                // Trong trường hợp có lỗi, rollback giao dịch
                await transaction.rollback();
                res.status(500).send({ message: 'Lỗi hệ thống. Vui lòng thử lại!' });
            }

            // Thêm giảng viên hướng dẫn nếu có
            if (data.advisorId) {
                await projectadvisors.create({
                    project_id: project.id,
                    advisor_id: data.advisorId
                }, { transaction });
            }

            await transaction.commit();
            res.status(200).send({ message: 'Tạo đề tài thành công, vui lòng kiểm tra lại tại trang danh sách' });
        } catch (error) {
            await transaction.rollback();
            console.error('Error creating project or students:', error);
            res.status(400).send({ message: error.message || 'Lỗi khi tạo dự án' });
        }
    }


    async updateTopic(req, res, next) {
        const { id } = req.params;
        const { title, description, start_date, end_date, status, advisor, students: studentList } = req.body;

        const transaction = await sequelize.transaction(); // Bắt đầu giao dịch

        try {
            let validStartDate = null;
            let validEndDate = null;

            if (status !== 'not_started') {
                validStartDate = start_date && !isNaN(Date.parse(start_date)) ? new Date(start_date) : null;
                validEndDate = end_date && !isNaN(Date.parse(end_date)) ? new Date(end_date) : null;
            }

            await projects.update(
                {
                    title,
                    description,
                    start_date: validStartDate,
                    end_date: validEndDate,
                    status,
                },
                { where: { id }, transaction }
            );

            // Xóa giảng viên cũ
            await projectadvisors.destroy({ where: { project_id: id }, transaction });

            // Thêm giảng viên mới nếu có
            if (advisor && advisor.trim() !== '') {
                const advisorID = advisor.split(' - ')[0];
                const advisorRecord = await advisors.findOne({ where: { advisorID }, transaction });

                if (advisorRecord) {
                    await projectadvisors.create(
                        {
                            project_id: id,
                            advisor_id: advisorRecord.id,
                        },
                        { transaction }
                    );
                } else {
                    throw new Error('Giảng viên không tồn tại. Vui lòng kiểm tra lại!');
                }
            }


            await projectstudents.destroy({
                where: { project_id: id },
                transaction,
            });

            // Xử lý thêm sinh viên
            const studentsToAdd = [];
            for (const student of studentList.filter(s => s && s !== '')) {
                const studentID = student.split(' - ')[0];
                const studentRecord = await students.findOne({ where: { studentID }, transaction });

                if (studentRecord) {
                    const existingProject = await projectstudents.findOne({
                        where: { student_id: studentRecord.id },
                        include: [{
                            model: projects,
                            as: 'project',
                            where: {
                                status: ['not_started', 'in_progress'],
                            },
                        }],
                        transaction,
                    });

                    if (existingProject) {
                        const studentInfo = await students.findOne({
                            where: { id: existingProject.student_id },
                            transaction,
                        });

                        // Gửi phản hồi lỗi và hủy giao dịch
                        await transaction.rollback();
                        return res.status(400).send({
                            message: `Sinh viên ${studentInfo.studentID} - ${studentInfo.lastname} ${studentInfo.firstname} đã tham gia một dự án khác. Vui lòng kiểm tra lại!`
                        });
                    }

                    studentsToAdd.push({
                        project_id: id,
                        student_id: studentRecord.id,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                }
            }

            if (studentsToAdd.length > 0) {
                await projectstudents.bulkCreate(studentsToAdd, { transaction });
            }

            await transaction.commit(); // Xác nhận giao dịch
            res.status(200).json({ message: 'Cập nhật thành công!' });
        } catch (error) {
            if (!transaction.finished) {
                await transaction.rollback(); // Hủy giao dịch nếu chưa rollback
            }
            console.error('Error updating project:', error);
            if (!res.headersSent) { // Kiểm tra xem phản hồi đã được gửi hay chưa
                res.status(500).json({ message: error.message || 'Lỗi khi cập nhật đề tài.', error });
            }
        }
    }
    async deleteProject(req, res, next) {
        const { id } = req.params;
        try {
            const project = await projects.findByPk(id);
            if (!project) {
                return res.status(404).json({ success: false, message: 'Dự án không tồn tại!' });
            }
            await project.destroy();
            res.json({ success: true, message: 'Xóa dự án thành công!' });
        } catch (error) {
            console.error('Error deleting project:', error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xóa dự án!' });
        }
    }



}
module.exports = new AdminController();
