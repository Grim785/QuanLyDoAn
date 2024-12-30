-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for database00
DROP DATABASE IF EXISTS `database00`;
CREATE DATABASE IF NOT EXISTS `database00` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `database00`;

-- Dumping structure for procedure database00.AddTimestamps
DROP PROCEDURE IF EXISTS `AddTimestamps`;
DELIMITER //
CREATE PROCEDURE `AddTimestamps`()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE tableName VARCHAR(255);
    DECLARE cur CURSOR FOR 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'database00';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO tableName;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Kiểm tra và thêm cột createdAt nếu chưa tồn tại
        IF NOT EXISTS (
            SELECT * FROM information_schema.columns 
            WHERE table_schema = 'database00' 
            AND table_name = tableName 
            AND column_name = 'createdAt'
        ) THEN
            SET @sql = CONCAT(
                'ALTER TABLE ', tableName, 
                ' ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP'
            );
            PREPARE stmt FROM @sql;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
        END IF;

        -- Kiểm tra và thêm cột updateAt nếu chưa tồn tại
        IF NOT EXISTS (
            SELECT * FROM information_schema.columns 
            WHERE table_schema = 'database00' 
            AND table_name = tableName 
            AND column_name = 'updatedAt'
        ) THEN
            SET @sql = CONCAT(
                'ALTER TABLE ', tableName, 
                ' ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
            );
            PREPARE stmt FROM @sql;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
        END IF;

    END LOOP;

    CLOSE cur;
END//
DELIMITER ;

-- Dumping structure for table database00.advisors
DROP TABLE IF EXISTS `advisors`;
CREATE TABLE IF NOT EXISTS `advisors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `advisorID` varchar(10) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('Nam','Nữ','Khác') NOT NULL,
  `address` varchar(255) NOT NULL,
  `userID` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `advisorID` (`advisorID`),
  KEY `userID` (`userID`),
  CONSTRAINT `advisors_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.advisors: ~2 rows (approximately)
REPLACE INTO `advisors` (`id`, `advisorID`, `lastname`, `firstname`, `date_of_birth`, `gender`, `address`, `userID`, `createdAt`, `updatedAt`) VALUES
	(1, '19992222', 'Lưu Thị', 'Thu Thủy', '1991-12-27', 'Nữ', '22A/74 Quận 1, Tp. Hồ Chí Minh', 3, '2024-12-27 00:24:23', '2024-12-29 01:25:52'),
	(2, '19992707', 'Hoàng Minh', 'Tuấn', '1978-12-27', 'Nam', '17E Quận Bình Thạnh, Tp. Hồ Chí Minh', 2, '2024-12-27 00:25:52', '2024-12-27 00:25:52');

-- Dumping structure for table database00.class_
DROP TABLE IF EXISTS `class_`;
CREATE TABLE IF NOT EXISTS `class_` (
  `id` int NOT NULL AUTO_INCREMENT,
  `classID` varchar(20) NOT NULL,
  `status` enum('active','inactive') NOT NULL,
  `majorsID` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `classID` (`classID`),
  KEY `majorsID` (`majorsID`),
  CONSTRAINT `class__ibfk_1` FOREIGN KEY (`majorsID`) REFERENCES `majors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.class_: ~3 rows (approximately)
REPLACE INTO `class_` (`id`, `classID`, `status`, `majorsID`, `createdAt`, `updatedAt`) VALUES
	(1, '22CPM01', 'active', 1, '2024-12-27 00:11:28', '2024-12-27 00:11:28'),
	(2, '22CTMĐT01', 'active', 3, '2024-12-27 00:12:53', '2024-12-27 00:12:53'),
	(3, '22CQTM01', 'active', 2, '2024-12-27 00:13:09', '2024-12-27 00:13:09');

-- Dumping structure for table database00.files
DROP TABLE IF EXISTS `files`;
CREATE TABLE IF NOT EXISTS `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_path` text NOT NULL,
  `uploaded_by` int NOT NULL,
  `uploaded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `file_size` int DEFAULT NULL,
  `file_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_avatar` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `files_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.files: ~0 rows (approximately)

-- Dumping structure for table database00.majors
DROP TABLE IF EXISTS `majors`;
CREATE TABLE IF NOT EXISTS `majors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.majors: ~3 rows (approximately)
REPLACE INTO `majors` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
	(1, 'Ứng dụng phần mềm', '2024-12-06 15:13:42', '2024-12-06 15:13:42'),
	(2, 'Quản trị mạng', '2024-12-06 15:13:58', '2024-12-06 15:13:58'),
	(3, 'Thương mại điện tử', '2024-12-06 15:14:18', '2024-12-06 15:14:18');

-- Dumping structure for table database00.projectadvisors
DROP TABLE IF EXISTS `projectadvisors`;
CREATE TABLE IF NOT EXISTS `projectadvisors` (
  `project_id` int NOT NULL,
  `advisor_id` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`,`advisor_id`) USING BTREE,
  KEY `advisor_id` (`advisor_id`) USING BTREE,
  CONSTRAINT `projectadvisors_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `projectadvisors_ibfk_2` FOREIGN KEY (`advisor_id`) REFERENCES `advisors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.projectadvisors: ~1 rows (approximately)
REPLACE INTO `projectadvisors` (`project_id`, `advisor_id`, `createdAt`, `updatedAt`) VALUES
	(1, 1, '2024-12-29 13:44:23', '2024-12-29 13:44:23');

-- Dumping structure for table database00.projectfeedback
DROP TABLE IF EXISTS `projectfeedback`;
CREATE TABLE IF NOT EXISTS `projectfeedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `projectfeedback_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `projectfeedback_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.projectfeedback: ~0 rows (approximately)

-- Dumping structure for table database00.projectfiles
DROP TABLE IF EXISTS `projectfiles`;
CREATE TABLE IF NOT EXISTS `projectfiles` (
  `project_id` int NOT NULL,
  `file_id` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`,`file_id`),
  KEY `file_id` (`file_id`),
  CONSTRAINT `projectfiles_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `projectfiles_ibfk_2` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.projectfiles: ~0 rows (approximately)

-- Dumping structure for table database00.projects
DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('not_started','in_progress','completed') DEFAULT 'not_started',
  `majorID` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `majorID` (`majorID`),
  CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`majorID`) REFERENCES `majors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.projects: ~18 rows (approximately)
REPLACE INTO `projects` (`id`, `title`, `description`, `start_date`, `end_date`, `status`, `majorID`, `createdAt`, `updatedAt`) VALUES
	(1, 'Hệ thống quản lý đồ án tốt nghiệp - Khoa công nghệ thông tin', 'Ứng dụng cung cấp môi trường làm quản thích hợp trong việc quản lý đồ án tốt nghiệp của khoa công nghệ thông tinHỗ trợ sinh viên, đăng ký, đăng tải, báo cáo tiến độ đề tàiHỗ trợ giảng viên theo dõi, đánh giá, xem xét đề tài, theo dõi tiến độ đề tài', NULL, NULL, 'not_started', 1, '2024-12-27 00:27:51', '2024-12-29 21:11:16'),
	(2, 'Hệ thống quản lý khám bệnh', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:34:02', '2024-12-29 09:18:19'),
	(3, 'Xây dựng ứng dụng web trên nền tảng Nodejs và MongoDB ', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:34:39', '2024-12-29 09:18:07'),
	(4, 'Xây dựng trang web bán liên kiện máy tính', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:35:31', '2024-12-29 09:18:08'),
	(5, 'Xây dựng phần mềm Quản lý phòng học', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:35:50', '2024-12-29 09:18:09'),
	(6, 'Xây dựng website bán giày', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:36:12', '2024-12-29 09:18:09'),
	(7, 'Phần Mềm Quản Lý Sinh Viên ', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:36:39', '2024-12-29 09:18:10'),
	(8, 'Trang web bán hàng trang sức', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:36:56', '2024-12-29 09:18:11'),
	(9, 'Thiết kế website bán thiết bị di động', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:37:15', '2024-12-29 09:18:11'),
	(10, 'Thiết kế website bán mô hình lắp ráp', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:37:49', '2024-12-29 09:18:12'),
	(11, 'Giải pháp Marketing thúc đẩy thương hiệu Khoa Công nghệ Thông tin trường Cao đẳng Bách khoa Sài Gòn trên nền tảng số', 'Mô tả', NULL, NULL, 'not_started', 3, '2024-12-27 00:38:26', '2024-12-29 09:18:12'),
	(12, 'Những yếu tố ảnh hưởng đến triển khai Chuyển đổi số tại trường cao đẳng Bách Khoa Sài Gòn', 'Mô tả', NULL, NULL, 'not_started', 3, '2024-12-27 00:38:54', '2024-12-29 09:18:13'),
	(13, 'Nâng cao hiệu quả Social Media marketing cho thương hiệu Gumac ', 'Mô tả', NULL, NULL, 'not_started', 3, '2024-12-27 00:39:14', '2024-12-29 09:18:14'),
	(14, 'Nghiên cứu về vai trò của trải nghiệm mua sắm trực tuyến trong việc thay đổi thói quen tiêu dùng của người tiêu dùng', 'Mô tả', NULL, NULL, 'not_started', 3, '2024-12-27 00:39:55', '2024-12-29 09:18:14'),
	(15, 'Nghiên cứu xu hướng thanh toán không tiền mặt và ảnh hưởng đến thương mại điện tử tại Việt Nam ', 'Mô tả', NULL, NULL, 'not_started', 3, '2024-12-27 00:40:33', '2024-12-29 09:18:15'),
	(16, 'Xây dựng hệ thống quản lý bán hàng sử dụng mã nguồn mở (OpenCart) ', 'Mô tả', NULL, NULL, 'not_started', 3, '2024-12-27 00:41:00', '2024-12-29 09:18:16'),
	(17, 'Xây dựng hệ thống mạng cho doanh nghiệp Thành Phát (Side - to - side)', 'Mô tả', NULL, NULL, 'not_started', 2, '2024-12-27 00:41:34', '2024-12-29 09:18:17'),
	(18, 'Thiết kế mạng và giải pháp quản trị mạng cho công ty Gia Hoà ', 'Mô tả', NULL, NULL, 'not_started', 2, '2024-12-27 00:42:06', '2024-12-29 09:18:18');

-- Dumping structure for table database00.projectsregister
DROP TABLE IF EXISTS `projectsregister`;
CREATE TABLE IF NOT EXISTS `projectsregister` (
  `project_id` int NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `note` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`) USING BTREE,
  CONSTRAINT `fk_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.projectsregister: ~1 rows (approximately)
REPLACE INTO `projectsregister` (`project_id`, `status`, `note`, `createdAt`, `updatedAt`) VALUES
	(1, 'pending', NULL, '2024-12-29 16:26:34', '2024-12-29 21:11:32');

-- Dumping structure for table database00.projectstudents
DROP TABLE IF EXISTS `projectstudents`;
CREATE TABLE IF NOT EXISTS `projectstudents` (
  `project_id` int NOT NULL,
  `student_id` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`,`student_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `projectstudents_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `projectstudents_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.projectstudents: ~2 rows (approximately)
REPLACE INTO `projectstudents` (`project_id`, `student_id`, `createdAt`, `updatedAt`) VALUES
	(1, 1, '2024-12-29 13:44:23', '2024-12-29 13:44:23'),
	(1, 2, '2024-12-29 13:44:23', '2024-12-29 13:44:23');

-- Dumping structure for procedure database00.ResetAutoIncrement
DROP PROCEDURE IF EXISTS `ResetAutoIncrement`;
DELIMITER //
CREATE PROCEDURE `ResetAutoIncrement`(databaseName VARCHAR(255))
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE tableName VARCHAR(255);
    DECLARE cur CURSOR FOR 
        SELECT table_name 
        FROM information_schema.tables
        WHERE table_schema = databaseName
          AND table_type = 'BASE TABLE';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO tableName;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SET @sql = CONCAT('ALTER TABLE ', databaseName, '.', tableName, ' AUTO_INCREMENT = 1');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;

    CLOSE cur;
END//
DELIMITER ;

-- Dumping structure for table database00.students
DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentID` varchar(10) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('Nam','Nữ','Khác') NOT NULL,
  `address` varchar(255) NOT NULL,
  `majorsID` int DEFAULT '1',
  `usersID` int NOT NULL,
  `classID` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `studentID` (`studentID`),
  KEY `majorsID` (`majorsID`),
  KEY `usersID` (`usersID`),
  KEY `FK_students_class` (`classID`),
  CONSTRAINT `FK_students_class` FOREIGN KEY (`classID`) REFERENCES `class_` (`id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`majorsID`) REFERENCES `majors` (`id`),
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`usersID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.students: ~6 rows (approximately)
REPLACE INTO `students` (`id`, `studentID`, `lastname`, `firstname`, `date_of_birth`, `gender`, `address`, `majorsID`, `usersID`, `classID`, `createdAt`, `updatedAt`) VALUES
	(1, '22001976', 'Trần Nguyên', 'Phát', '2004-07-27', 'Nam', '999/3A Quận 12, Tp. Hồ Chí Minh', 1, 4, 1, '2024-12-27 00:14:33', '2024-12-27 00:14:33'),
	(2, '22001955', 'Lê Thanh', 'Ngân', '2004-12-27', 'Nữ', '111/5A Gò Vấp, Tp. Hồ Chí Minh', 2, 5, 3, '2024-12-27 00:17:52', '2024-12-27 00:17:52'),
	(3, '22002044', 'Nguyễn Văn', 'Thanh', '2003-12-27', 'Nam', '333/4B Gò Vấp, Tp. Hồ Chí Minh', 3, 6, 2, '2024-12-27 00:19:22', '2024-12-27 00:20:50'),
	(4, '22007865', 'Hoàng Minh', 'Nhân', '2002-12-27', 'Nam', '17/2D Bình Thạnh, Tp. Hồ Chí Minh', 1, 7, 1, '2024-12-27 00:20:45', '2024-12-27 00:20:45'),
	(5, '22009999', 'Lê Nhật', 'Linh', '2004-10-27', 'Nữ', '55/2E Gò Vấp, Tp. Hồ Chí Minh', 2, 8, 3, '2024-12-27 00:22:32', '2024-12-27 00:22:32'),
	(8, '22001979', 'Nguyễn Phương', 'Nhung', '2024-12-29', 'Nữ', '999/3A Quận 12, Tp. Hồ Chí Minh', 1, 13, 1, '2024-12-29 14:06:41', '2024-12-29 14:06:41');

-- Dumping structure for table database00.suggestedprojects
DROP TABLE IF EXISTS `suggestedprojects`;
CREATE TABLE IF NOT EXISTS `suggestedprojects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.suggestedprojects: ~3 rows (approximately)
REPLACE INTO `suggestedprojects` (`id`, `title`, `createdAt`, `updatedAt`) VALUES
	(1, 'Ứng dụng quản lý nhà hàng tiệc cưới Mặt Trời Mới', '2024-12-23 21:04:33', '2024-12-23 21:04:33'),
	(2, 'Giải pháp thiết kế hệ thống mạng trường Cao đẳng Bách Khoa Sài Gòn', '2024-12-23 21:04:33', '2024-12-23 21:04:33'),
	(3, 'Đánh giá hiệu quả của các chiến lược tiếp thị số trong kinh doanh thương mại điện tử ', '2024-12-23 21:04:33', '2024-12-23 21:04:33');

-- Dumping structure for table database00.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','advisor','admin') NOT NULL,
  `gmail` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `gmail` (`gmail`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.users: ~11 rows (approximately)
REPLACE INTO `users` (`id`, `username`, `password`, `role`, `gmail`, `phone`, `createdAt`, `updatedAt`, `active`) VALUES
	(1, 'admin', '$2b$10$6jMp5LqDK1evCv46dWT3RONdSdJ9m7BLDBOcRUuu8bq/T5R91tNOe', 'admin', '123123@gmail.com', '1111111111', '2024-12-27 00:01:01', '2024-12-27 00:01:14', 1),
	(2, '19992707', '$2b$10$6jMp5LqDK1evCv46dWT3RONdSdJ9m7BLDBOcRUuu8bq/T5R91tNOe', 'advisor', '123321@gmail.com', '2222222222', '2024-12-27 00:02:47', '2024-12-27 00:03:24', 1),
	(3, '19992222', '$2b$10$6jMp5LqDK1evCv46dWT3RONdSdJ9m7BLDBOcRUuu8bq/T5R91tNOe', 'advisor', '123333@gmail.com', '2222222223', '2024-12-27 00:04:12', '2024-12-27 00:45:17', 1),
	(4, '22001976', '$2b$10$6jMp5LqDK1evCv46dWT3RONdSdJ9m7BLDBOcRUuu8bq/T5R91tNOe', 'student', 'kem@gmail.com', '8743254765', '2024-12-27 00:06:08', '2024-12-27 00:45:18', 1),
	(5, '22001955', '$2b$10$6jMp5LqDK1evCv46dWT3RONdSdJ9m7BLDBOcRUuu8bq/T5R91tNOe', 'student', '05@gmail.com', '8632456781', '2024-12-27 00:06:44', '2024-12-27 00:45:19', 1),
	(6, '22002044', '$2b$10$6jMp5LqDK1evCv46dWT3RONdSdJ9m7BLDBOcRUuu8bq/T5R91tNOe', 'student', '06@gmail.com', '0486534475', '2024-12-27 00:07:17', '2024-12-27 00:45:20', 1),
	(7, '22007865', '$2b$10$6jMp5LqDK1evCv46dWT3RONdSdJ9m7BLDBOcRUuu8bq/T5R91tNOe', 'student', '07@gmail.com', '9435658323', '2024-12-27 00:07:50', '2024-12-27 00:45:21', 1),
	(8, '22009999', '$2b$10$6jMp5LqDK1evCv46dWT3RONdSdJ9m7BLDBOcRUuu8bq/T5R91tNOe', 'student', '08@gmail.com', '1268553537', '2024-12-27 00:08:20', '2024-12-27 00:45:22', 1),
	(10, '22009900', '$2b$10$6jMp5LqDK1evCv46dWT3RONdSdJ9m7BLDBOcRUuu8bq/T5R91tNOe', 'advisor', NULL, NULL, '2024-12-27 05:49:53', '2024-12-29 20:52:40', 1),
	(11, '22009993', '$2b$10$6jMp5LqDK1evCv46dWT3RONdSdJ9m7BLDBOcRUuu8bq/T5R91tNOe', 'student', NULL, NULL, '2024-12-27 05:58:52', '2024-12-29 20:52:42', 1),
	(13, '22001979', '$2b$10$6jMp5LqDK1evCv46dWT3RONdSdJ9m7BLDBOcRUuu8bq/T5R91tNOe', 'student', NULL, NULL, '2024-12-29 13:52:03', '2024-12-29 20:52:42', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;


DROP TABLE IF EXISTS `progress`;
CREATE TABLE IF NOT EXISTS `progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `project_id` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_progress_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

REPLACE INTO `progress` (`id`, `title`, `content`, `project_id`, `createdAt`, `updatedAt`) VALUES
	(1,'tiến trình 1','nội dung tuần 1',1,'2024-12-27 00:14:33', '2024-12-27 00:14:33'),
  (2,'tiến trình 2','nội dung tuần 1',1,'2024-12-27 00:14:33', '2024-12-27 00:14:33'),
  (3,'tiến trình 3','nội dung tuần 1',2,'2024-12-27 00:14:33', '2024-12-27 00:14:33'),
  (4,'tiến trình 4','nội dung tuần 1',1,'2024-12-27 00:14:33', '2024-12-27 00:14:33')