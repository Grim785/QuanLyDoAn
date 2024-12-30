const { where, Op } = require("sequelize");
const sequelize = require("../../config/db");
const initModels = require("../models/init-models");
// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
const { projects, projectadvisors, advisors, projectstudents, students, users, class_, projectfiles, files, majors } = models;

class ProjectController {
//[GET] /project
  //---Giao diện danh sách đề tài
  async projectList(req, res, next) {
    try {
      const role = req.session.user.role;
      const majorList = await majors.findAll();
      console.log(majorList);
      const list = await projects.findAll({
        include: [
          {
            model: projectadvisors,
            as: 'projectadvisors',
            attributes: ['project_id'],
            include: [
              {
                model: advisors,
                as: 'advisor',
                attributes: ['advisorID', 'lastname', 'firstname']
              }
            ]
          },
          {
            model: projectstudents,
            as: 'projectstudents',
            attributes: ['project_id'],
            include: [
              {
                model: students,
                as: 'student',
                attributes: ['studentID', 'lastname', 'firstname']
              }
            ]
          },
          {
            model: majors,
            as: 'major',
            attributes: ['id', 'name']
          }
        ]
      });
      res.render('roles/project/project-list', {
        title: 'Dashboard admin',
        list: list,
        majorList: majorList,
        //Truyền dữ liệu hiển thị thành phần------
        showHeaderFooter: true,
        showNav: true,
        role: role
        //----------------------------------------
      });
    } catch (error) {
      console.log(error);
    }
  }
  //---Giao diện chi tiết đề tài
  async projectDetails(req, res, next) {
    const topicId = req.params.id;
    // const Progress = await progress.findAll({
    //     where:{project_id: topicId}
    // })
    // console.log(Progress.title);
    try {
      const role = req.session.user.role;
      const projectDetails = await projects.findOne({
        where: { id: topicId },
        include: [
          // Nối đến bảng chuyên ngành lấy thông tin chuyên ngành của đề tài
          {
            model: majors,
            as: 'major',
            attributes: ['name'],
          },
          // Lấy thông tin giảng viên tham gia
          {
            model: projectadvisors,
            as: 'projectadvisors',
            attributes: ['advisor_id'],
            include: [
              {
                model: advisors,
                as: 'advisor',
                attributes: ['lastname', 'firstname']
              }
            ]
          },
          // Lấy thông tin sinh viên tham gia
          {
            model: projectstudents,
            as: 'projectstudents',
            attributes: ['student_id'],
            include: [
              {
                model: students,
                as: 'student',
                attributes: ['studentID', 'lastname', 'firstname', 'classID'],
                include: [
                  {
                    model: users,
                    as: 'user',
                    attributes: ['role']
                  },
                  {
                    model: class_,
                    as: 'class',
                    attributes: ['classID']
                  }
                ]
              }
            ]
          },
          // Lấy thông tin file liên kết với dự án
          {
            model: projectfiles,
            as: 'projectfiles',
            include: [
              {
                model: files,
                as: 'file',
                attributes: ['file_name', 'file_path']
              }
            ]
          }
        ],
        attributes: ['title', 'description', 'start_date', 'end_date', 'status'],
      });

      // In dữ liệu dễ đọc với JSON.stringify để debug
      console.log(JSON.stringify(projectDetails, null, 2));

      // Lấy thông tin file (nếu có)
      const projectFile = projectDetails.projectfiles.length > 0 ? projectDetails.projectfiles[0].file : null;

      // Render dữ liệu ra view
      res.render('roles/project/project-detail', {
        title: 'Chi tiết đề tài',
        // progress: Progress,
        projectDetails: projectDetails,
        projectFile: projectFile, // Truyền thông tin file
        // Truyền dữ liệu hiển thị thành phần
        showHeaderFooter: true,
        showNav: true,
        role: role,
        //----------------------
      });
    } catch (error) {
      console.log(error);
      // res.status(500).render('error', {
      //   title: 'Error',
      //   message: 'An error occurred while fetching the topic'
      // });
    }
  }
  //---Chức năng tìm kiếm đề tài
  async searchProjects(req, res) {
    try {
      const query = req.query.query || ''; // Lấy từ khóa tìm kiếm
      const results = await projects.findAll({
        where: {
          title: {
            [Op.like]: `%${query}%` // Tìm kiếm theo từ khóa trong tên đề tài
          }
        },
        include: [
          {
            model: projectadvisors,
            as: 'projectadvisors',
            include: [
              {
                model: advisors,
                as: 'advisor',
                attributes: ['advisorID', 'firstname', 'lastname']
              }
            ]
          },
          {
            model: projectstudents,
            as: 'projectstudents',
            include: [
              {
                model: students,
                as: 'student',
                attributes: ['studentID', 'firstname', 'lastname']
              }
            ]
          }
        ]
      });

      res.json(results); // Trả về dữ liệu JSON
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình tìm kiếm' });
    }
  }
//[POST] /project
  //---Chức năng thêm mới đề tài /add
  async addProject(req, res) {
    try {
      const { title, description, majorID } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!title) {
        return res.status(400).json({ error: 'Tên đề tài là bắt buộc!' });
      }

      // Thêm mới đề tài
      const newProject = await projects.create({
        title,
        description,
        majorID,
      });

      res.status(201).json({ message: 'Đề tài đã được thêm thành công!', project: newProject });
    } catch (error) {
      console.error('Lỗi khi thêm mới đề tài:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm mới đề tài.' });
    }
  }
  //---Chức năng xóa đề tài /delete
  async deleteProject(req, res) {
    try {
      const { ids } = req.body;

      if (!ids || ids.length === 0) {
        return res.status(400).json({ error: 'Danh sách ID không hợp lệ!' });
      }

      // Thực hiện xóa các dự án với danh sách ID
      await projects.destroy({
        where: {
          id: ids,
        },
      });

      res.status(200).json({ message: 'Đã xóa thành công!' });
    } catch (error) {
      console.error('Lỗi khi xóa dự án:', error);
      res.status(500).json({ error: 'Có lỗi xảy ra khi xóa dự án.' });
    }
  }
  //---Chức năng cập nhật đề tài /update
  async updateProject(req, res, next) {
    const { projects: projectList } = req.body;

    const transaction = await sequelize.transaction(); // Bắt đầu giao dịch

    try {
      for (const project of projectList) {
        const { id, title, description, start_date, end_date, status, advisor, students: studentList } = project;

        let validStartDate = null;
        let validEndDate = null;

        if (status !== 'not_started') {
          validStartDate = start_date && !isNaN(Date.parse(start_date)) ? new Date(start_date) : null;
          validEndDate = end_date && !isNaN(Date.parse(end_date)) ? new Date(end_date) : null;
        }

        // Cập nhật dự án
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

        // Thêm giảng viên mới
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
            throw new Error(`Giảng viên không tồn tại: ${advisor}`);
          }
        }

        // Xóa sinh viên cũ
        await projectstudents.destroy({ where: { project_id: id }, transaction });

        // Thêm sinh viên mới
        const studentsToAdd = [];
        for (const student of studentList.filter((s) => s && s !== '')) {
          const studentID = student.split(' - ')[0];
          const studentRecord = await students.findOne({ where: { studentID }, transaction });

          if (studentRecord) {
            const existingProject = await projectstudents.findOne({
              where: { student_id: studentRecord.id },
              include: [
                {
                  model: projects,
                  as: 'project',
                  where: { status: ['not_started', 'in_progress'] },
                },
              ],
              transaction,
            });

            if (existingProject) {
              const studentInfo = await students.findOne({ where: { id: existingProject.student_id }, transaction });

              // Rollback và trả lỗi
              await transaction.rollback();
              return res.status(400).json({
                message: `Sinh viên ${studentInfo.studentID} - ${studentInfo.lastname} ${studentInfo.firstname} đã tham gia dự án khác.`,
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
      }

      await transaction.commit(); // Xác nhận giao dịch
      res.status(200).json({ message: 'Cập nhật thành công!' });
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback(); // Hủy giao dịch nếu có lỗi
      }
      console.error('Error updating projects:', error);
      res.status(500).json({ message: error.message || 'Lỗi khi cập nhật danh sách dự án.', error });
    }
  }

}
module.exports = new ProjectController();