const { where, Op } = require("sequelize");
const sequelize = require("../../config/db");
const initModels = require("../models/init-models");
// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
const { projects, projectadvisors, advisors, projectstudents, students, users, class_, projectfiles, files, majors, progress } = models;

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
        title: 'Danh sách đề tài',
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
          },
          //Lấy thông tin báo cáo tiến độ
          {
            model: progress,
            as: 'progresses',
            attributes: ['id', 'title', 'content', 'project_id']
          }
        ],
        attributes: ['id','title', 'description', 'start_date', 'end_date', 'status'],
      });

      const progresses = projectDetails.progresses;
      // Lấy thông tin file (nếu có)
      const projectFile = projectDetails.projectfiles.length > 0 ? projectDetails.projectfiles[0].file : null;

      // Render dữ liệu ra view
      res.render('roles/project/project-detail', {
        title: 'Chi tiết đề tài',
        // progress: Progress,
        progress:progresses,
        projectDetails: projectDetails,
        projectFile: projectFile,
        // Truyền dữ liệu hiển thị thành phần
        showHeaderFooter: true,
        showNav: true,
        role: role,
        //----------------------
      });
    } catch (error) {
      console.log(error);
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
  //---Chức năng thêm mới báo cáo tiến độ /addPogress
  async addProgress(req, res, next) {
      const title = req.body.title;
      const projectid = req.body.projectid;
      try {
          await progress.create({
              title: title,
              content: '',
              project_id: projectid
          })
          res.json({ success: true });
      } catch (error) {
          res.status(500).json({ success: false, message: 'Đã xảy ra lỗi!' });
      }
  }
//[PUT] /project
  async updateProgress(req, res, next) {
    const { Id } = req.params;
    const title = req.body.title;
    const content = req.body.content;
    try {
        await progress.update({
            title: title,
            content: content,
        }, {
            where: { id: Id }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi' });
    }
  }
//[DELETE] /project
  //---Chức năng xóa tiến độ /deleteProgress/:progressId
  async deleteProgress(req, res, next) {
      const id = req.params.progressid;
      console.log(id);
      try {
          await progress.destroy({
              where: { id: id }
          });
          res.json({ success: true });
      } catch (error) {
          res.status(500).json({ success: false, message: 'Đã xảy ra lỗi!' });
      }
  }
}
module.exports = new ProjectController();