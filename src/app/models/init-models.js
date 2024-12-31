var DataTypes = require("sequelize").DataTypes;
var _advisors = require("./advisors");
var _class_ = require("./class_");
var _files = require("./files");
var _majors = require("./majors");
var _progress = require("./progress");
var _projectadvisors = require("./projectadvisors");
var _projectfeedback = require("./projectfeedback");
var _projectfiles = require("./projectfiles");
var _projects = require("./projects");
var _projectsregister = require("./projectsregister");
var _projectstudents = require("./projectstudents");
var _students = require("./students");
var _suggestedprojects = require("./suggestedprojects");
var _users = require("./users");

function initModels(sequelize) {
  var advisors = _advisors(sequelize, DataTypes);
  var class_ = _class_(sequelize, DataTypes);
  var files = _files(sequelize, DataTypes);
  var majors = _majors(sequelize, DataTypes);
  var progress = _progress(sequelize, DataTypes);
  var projectadvisors = _projectadvisors(sequelize, DataTypes);
  var projectfeedback = _projectfeedback(sequelize, DataTypes);
  var projectfiles = _projectfiles(sequelize, DataTypes);
  var projects = _projects(sequelize, DataTypes);
  var projectsregister = _projectsregister(sequelize, DataTypes);
  var projectstudents = _projectstudents(sequelize, DataTypes);
  var students = _students(sequelize, DataTypes);
  var suggestedprojects = _suggestedprojects(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  advisors.belongsToMany(projects, { as: 'project_id_projects', through: projectadvisors, foreignKey: "advisor_id", otherKey: "project_id" });
  files.belongsToMany(projects, { as: 'project_id_projects_projectfiles', through: projectfiles, foreignKey: "file_id", otherKey: "project_id" });
  projects.belongsToMany(advisors, { as: 'advisor_id_advisors', through: projectadvisors, foreignKey: "project_id", otherKey: "advisor_id" });
  projects.belongsToMany(files, { as: 'file_id_files', through: projectfiles, foreignKey: "project_id", otherKey: "file_id" });
  projects.belongsToMany(students, { as: 'student_id_students', through: projectstudents, foreignKey: "project_id", otherKey: "student_id" });
  students.belongsToMany(projects, { as: 'project_id_projects_projectstudents', through: projectstudents, foreignKey: "student_id", otherKey: "project_id" });
  projectadvisors.belongsTo(advisors, { as: "advisor", foreignKey: "advisor_id"});
  advisors.hasMany(projectadvisors, { as: "projectadvisors", foreignKey: "advisor_id"});
  students.belongsTo(class_, { as: "class", foreignKey: "classID"});
  class_.hasMany(students, { as: "students", foreignKey: "classID"});
  projectfiles.belongsTo(files, { as: "file", foreignKey: "file_id"});
  files.hasMany(projectfiles, { as: "projectfiles", foreignKey: "file_id"});
  class_.belongsTo(majors, { as: "major", foreignKey: "majorsID"});
  majors.hasMany(class_, { as: "class_s", foreignKey: "majorsID"});
  projects.belongsTo(majors, { as: "major", foreignKey: "majorID"});
  majors.hasMany(projects, { as: "projects", foreignKey: "majorID"});
  students.belongsTo(majors, { as: "major", foreignKey: "majorsID"});
  majors.hasMany(students, { as: "students", foreignKey: "majorsID"});
  progress.belongsTo(projects, { as: "project", foreignKey: "project_id"});
  projects.hasMany(progress, { as: "progresses", foreignKey: "project_id"});
  projectadvisors.belongsTo(projects, { as: "project", foreignKey: "project_id"});
  projects.hasMany(projectadvisors, { as: "projectadvisors", foreignKey: "project_id"});
  projectfeedback.belongsTo(projects, { as: "project", foreignKey: "project_id"});
  projects.hasMany(projectfeedback, { as: "projectfeedbacks", foreignKey: "project_id"});
  projectfiles.belongsTo(projects, { as: "project", foreignKey: "project_id"});
  projects.hasMany(projectfiles, { as: "projectfiles", foreignKey: "project_id"});
  projectsregister.belongsTo(projects, { as: "project", foreignKey: "project_id"});
  projects.hasOne(projectsregister, { as: "projectsregister", foreignKey: "project_id"});
  projectstudents.belongsTo(projects, { as: "project", foreignKey: "project_id"});
  projects.hasMany(projectstudents, { as: "projectstudents", foreignKey: "project_id"});
  projectstudents.belongsTo(students, { as: "student", foreignKey: "student_id"});
  students.hasMany(projectstudents, { as: "projectstudents", foreignKey: "student_id"});
  advisors.belongsTo(users, { as: "user", foreignKey: "userID"});
  users.hasMany(advisors, { as: "advisors", foreignKey: "userID"});
  files.belongsTo(users, { as: "uploaded_by_user", foreignKey: "uploaded_by"});
  users.hasMany(files, { as: "files", foreignKey: "uploaded_by"});
  projectfeedback.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(projectfeedback, { as: "projectfeedbacks", foreignKey: "user_id"});
  students.belongsTo(users, { as: "user", foreignKey: "usersID"});
  users.hasMany(students, { as: "students", foreignKey: "usersID"});

  return {
    advisors,
    class_,
    files,
    majors,
    progress,
    projectadvisors,
    projectfeedback,
    projectfiles,
    projects,
    projectsregister,
    projectstudents,
    students,
    suggestedprojects,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
