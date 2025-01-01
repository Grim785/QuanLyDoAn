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

-- Dumping data for table database00.advisors: ~6 rows (approximately)
REPLACE INTO `advisors` (`id`, `advisorID`, `lastname`, `firstname`, `date_of_birth`, `gender`, `address`, `userID`, `createdAt`, `updatedAt`) VALUES
	(1, '11002221', 'Từ Thị', 'Xuân Hiền', '2025-01-01', 'Nữ', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 2, '2025-01-01 07:21:47', '2025-01-01 07:21:47'),
	(2, '11002222', 'Nguyễn Đức', 'Cương', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 3, '2025-01-01 07:22:57', '2025-01-01 07:22:57'),
	(3, '11002223', 'Lê Thị', 'Cẩm Tú', '2025-01-01', 'Nữ', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 4, '2025-01-01 07:23:30', '2025-01-01 07:23:30'),
	(4, '11002224', 'Nguyễn Phương', 'Hồng', '2025-01-01', 'Nữ', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 5, '2025-01-01 07:24:00', '2025-01-01 07:24:00'),
	(5, '11002225', 'Nguyễn Thị', 'Phương Loan', '2025-01-01', 'Nữ', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 6, '2025-01-01 07:24:25', '2025-01-01 07:24:25'),
	(6, '11002226', 'Quách Biên', 'Cương', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 7, '2025-01-01 07:25:00', '2025-01-01 07:25:00');

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
	(2, '22TMĐT01', 'active', 3, '2024-12-27 00:12:53', '2025-01-01 14:35:52'),
	(3, '22QTM01', 'active', 2, '2024-12-27 00:13:09', '2025-01-01 14:35:54');

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

-- Dumping structure for table database00.progress
DROP TABLE IF EXISTS `progress`;
CREATE TABLE IF NOT EXISTS `progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `project_id` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_progress_project` (`project_id`),
  CONSTRAINT `FK_progress_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.progress: ~0 rows (approximately)

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

-- Dumping data for table database00.projectadvisors: ~2 rows (approximately)
REPLACE INTO `projectadvisors` (`project_id`, `advisor_id`, `createdAt`, `updatedAt`) VALUES
	(1, 2, '2025-01-01 07:51:12', '2025-01-01 07:51:12'),
	(2, 1, '2025-01-01 07:47:49', '2025-01-01 07:47:49'),
	(3, 1, '2025-01-01 07:48:24', '2025-01-01 07:48:24');

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
  `status` enum('not_started','in_progress','completed','abandoned') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'not_started',
  `majorID` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `majorID` (`majorID`),
  CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`majorID`) REFERENCES `majors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.projects: ~22 rows (approximately)
REPLACE INTO `projects` (`id`, `title`, `description`, `start_date`, `end_date`, `status`, `majorID`, `createdAt`, `updatedAt`) VALUES
	(1, 'Hệ thống quản lý đồ án tốt nghiệp - Khoa công nghệ thông tin', 'Ứng dụng cung cấp môi trường làm quản thích hợp trong việc quản lý đồ án tốt nghiệp của khoa công nghệ thông tinHỗ trợ sinh viên, đăng ký, đăng tải, báo cáo tiến độ đề tàiHỗ trợ giảng viên theo dõi, đánh giá, xem xét đề tài, theo dõi tiến độ đề tài', '2025-01-01', NULL, 'in_progress', 1, '2024-12-27 00:27:51', '2025-01-01 15:03:57'),
	(2, 'Hệ thống quản lý khám bệnh', 'Mô tả', '2025-01-01', '2025-01-01', 'completed', 1, '2024-12-27 00:34:02', '2025-01-01 07:47:49'),
	(3, 'Xây dựng ứng dụng web trên nền tảng Nodejs và MongoDB ', 'Mô tả', '2025-01-01', NULL, 'in_progress', 1, '2024-12-27 00:34:39', '2025-01-01 07:48:24'),
	(4, 'Xây dựng trang web bán liên kiện máy tính', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:35:31', '2025-01-01 07:15:48'),
	(5, 'Xây dựng phần mềm Quản lý phòng học', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:35:50', '2025-01-01 07:15:48'),
	(6, 'Xây dựng website bán giày', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:36:12', '2025-01-01 07:15:48'),
	(7, 'Phần Mềm Quản Lý Sinh Viên ', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:36:39', '2025-01-01 07:15:48'),
	(8, 'Trang web bán hàng trang sức', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:36:56', '2025-01-01 07:15:48'),
	(9, 'Thiết kế website bán thiết bị di động', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:37:15', '2025-01-01 07:15:48'),
	(10, 'Thiết kế website bán mô hình lắp ráp', 'Mô tả', NULL, NULL, 'not_started', 1, '2024-12-27 00:37:49', '2025-01-01 07:15:48'),
	(11, 'Giải pháp Marketing thúc đẩy thương hiệu Khoa Công nghệ Thông tin trường Cao đẳng Bách khoa Sài Gòn trên nền tảng số', 'Mô tả', NULL, NULL, 'not_started', 3, '2024-12-27 00:38:26', '2025-01-01 07:15:48'),
	(12, 'Những yếu tố ảnh hưởng đến triển khai Chuyển đổi số tại trường cao đẳng Bách Khoa Sài Gòn', 'Mô tả', NULL, NULL, 'not_started', 3, '2024-12-27 00:38:54', '2025-01-01 07:15:48'),
	(13, 'Nâng cao hiệu quả Social Media marketing cho thương hiệu Gumac ', 'Mô tả', NULL, NULL, 'not_started', 3, '2024-12-27 00:39:14', '2025-01-01 07:15:48'),
	(14, 'Nghiên cứu về vai trò của trải nghiệm mua sắm trực tuyến trong việc thay đổi thói quen tiêu dùng của người tiêu dùng', 'Mô tả', NULL, NULL, 'not_started', 3, '2024-12-27 00:39:55', '2025-01-01 07:15:48'),
	(15, 'Nghiên cứu xu hướng thanh toán không tiền mặt và ảnh hưởng đến thương mại điện tử tại Việt Nam ', 'Mô tả', NULL, NULL, 'not_started', 3, '2024-12-27 00:40:33', '2025-01-01 07:15:48'),
	(16, 'Xây dựng hệ thống quản lý bán hàng sử dụng mã nguồn mở (OpenCart) ', 'Mô tả', NULL, NULL, 'not_started', 3, '2024-12-27 00:41:00', '2025-01-01 07:15:48'),
	(17, 'Xây dựng hệ thống mạng cho doanh nghiệp Thành Phát (Side - to - side)', 'Mô tả', NULL, NULL, 'not_started', 2, '2024-12-27 00:41:34', '2025-01-01 07:15:48'),
	(18, 'Thiết kế mạng và giải pháp quản trị mạng cho công ty Gia Hoà ', 'Mô tả', NULL, NULL, 'not_started', 2, '2024-12-27 00:42:06', '2025-01-01 07:15:48');

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

-- Dumping data for table database00.projectsregister: ~3 rows (approximately)
REPLACE INTO `projectsregister` (`project_id`, `status`, `note`, `createdAt`, `updatedAt`) VALUES
	(1, 'pending', NULL, '2025-01-01 14:49:35', '2025-01-01 14:49:35'),
	(2, 'approved', NULL, '2025-01-01 14:48:42', '2025-01-01 14:49:14'),
	(3, 'approved', NULL, '2025-01-01 14:48:50', '2025-01-01 14:49:11');

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

-- Dumping data for table database00.projectstudents: ~7 rows (approximately)
REPLACE INTO `projectstudents` (`project_id`, `student_id`, `createdAt`, `updatedAt`) VALUES
	(1, 9, '2025-01-01 07:51:12', '2025-01-01 07:51:12'),
	(1, 10, '2025-01-01 07:51:12', '2025-01-01 07:51:12'),
	(1, 11, '2025-01-01 07:51:12', '2025-01-01 07:51:12'),
	(1, 12, '2025-01-01 07:51:12', '2025-01-01 07:51:12'),
	(2, 1, '2025-01-01 07:47:49', '2025-01-01 07:47:49'),
	(2, 2, '2025-01-01 07:47:49', '2025-01-01 07:47:49'),
	(3, 3, '2025-01-01 07:48:24', '2025-01-01 07:48:24');

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

-- Dumping data for table database00.students: ~29 rows (approximately)
REPLACE INTO `students` (`id`, `studentID`, `lastname`, `firstname`, `date_of_birth`, `gender`, `address`, `majorsID`, `usersID`, `classID`, `createdAt`, `updatedAt`) VALUES
	(1, '22001965', 'Trang Quốc', 'Trường', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 8, 1, '2025-01-01 07:25:58', '2025-01-01 07:25:58'),
	(2, '22001970', 'Trần Minh', 'Nhật', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 9, 1, '2025-01-01 07:26:29', '2025-01-01 07:26:29'),
	(3, '22001881', 'Phan Phạm', 'Hoàng Hải', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 10, 1, '2025-01-01 07:26:58', '2025-01-01 07:26:58'),
	(4, '22001795', 'Phạm Nguyễn', 'Minh Huy', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 11, 1, '2025-01-01 07:27:25', '2025-01-01 07:27:25'),
	(5, '22002451', 'Trần An', 'Phước', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 12, 1, '2025-01-01 07:27:55', '2025-01-01 07:27:55'),
	(6, '22000290', 'Nguyễn Vũ', 'Gia Bảo', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 13, 1, '2025-01-01 07:28:43', '2025-01-01 07:28:43'),
	(7, '22001460', 'Nguyễn Bạch', 'Dương', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 14, 1, '2025-01-01 07:29:04', '2025-01-01 07:29:04'),
	(8, '22001599', 'Nguyễn Hoài', 'Vũ', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 15, 1, '2025-01-01 07:29:30', '2025-01-01 07:29:30'),
	(9, '22001846', 'Huỳnh Chí', 'Thành', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 16, 1, '2025-01-01 07:30:07', '2025-01-01 07:30:07'),
	(10, '22001976', 'Trần Nguyên', 'Phát', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 17, 1, '2025-01-01 07:30:41', '2025-01-01 07:30:41'),
	(11, '22002070', 'Nguyễn Văn', 'An', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 18, 1, '2025-01-01 07:31:17', '2025-01-01 07:31:17'),
	(12, '22001786', 'Nguyễn Quốc', 'Bảo', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 19, 1, '2025-01-01 07:31:45', '2025-01-01 07:31:45'),
	(13, '22002398', 'Vũ Minh', 'Hiền', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 20, 1, '2025-01-01 07:32:12', '2025-01-01 07:32:12'),
	(14, '22002240', 'Nguyễn Thành', 'Thông', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 21, 1, '2025-01-01 07:32:37', '2025-01-01 07:32:37'),
	(15, '22001579', 'Lê Nguyễn', 'Thành Tâm', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 22, 1, '2025-01-01 07:33:18', '2025-01-01 07:33:18'),
	(16, '22002009', 'Trần Minh', 'Quang', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 23, 1, '2025-01-01 07:33:41', '2025-01-01 07:33:41'),
	(17, '22001666', 'Nguyễn Tuấn', 'Anh', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 24, 1, '2025-01-01 07:34:16', '2025-01-01 07:34:16'),
	(18, '22001817', 'Đỗ Quốc', 'Nghĩa', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 25, 2, '2025-01-01 07:35:59', '2025-01-01 07:35:59'),
	(19, '22002085', 'Trương Quốc', 'Huy', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 26, 2, '2025-01-01 07:36:35', '2025-01-01 07:36:35'),
	(20, '22002088', 'Trần Thị', 'Yến Nhi', '2025-01-01', 'Nữ', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 27, 2, '2025-01-01 07:37:02', '2025-01-01 07:44:11'),
	(21, '22001445', 'Nguyễn Đức', 'Danh', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 28, 2, '2025-01-01 07:37:37', '2025-01-01 07:37:37'),
	(22, '22001501', 'Trần Duy', 'Linh', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 29, 2, '2025-01-01 07:38:05', '2025-01-01 07:38:05'),
	(23, '22001909', 'Ngô Thị', 'Hồng Nhung', '2025-01-01', 'Nữ', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 30, 2, '2025-01-01 07:38:27', '2025-01-01 07:44:11'),
	(24, '22001963', 'Ngô Nhật', 'Khang', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 31, 2, '2025-01-01 07:38:58', '2025-01-01 07:38:58'),
	(25, '22002094', 'Lê Hoàng', 'Quân', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 32, 2, '2025-01-01 07:39:24', '2025-01-01 07:39:24'),
	(26, '22000214', 'Dương Thành', 'Tiến', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 33, 2, '2025-01-01 07:39:48', '2025-01-01 07:39:48'),
	(27, '22002414', 'Lê Thị', 'Thu Linh', '2025-01-01', 'Nữ', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 34, 2, '2025-01-01 07:40:15', '2025-01-01 07:44:11'),
	(28, '22002415', 'Nguyễn Kim', 'Thủy', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 35, 2, '2025-01-01 07:40:36', '2025-01-01 07:40:36'),
	(29, '22000279', 'Trần Thị', 'Minh Trang', '2025-01-01', 'Nữ', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 36, 2, '2025-01-01 07:40:57', '2025-01-01 07:44:11'),
	(30, '22001816', 'Nguyễn Lê', 'Hải Âu', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 37, 3, '2025-01-01 07:41:23', '2025-01-01 07:41:23'),
	(31, '22002108', 'Nguyễn Minh', 'Chánh', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 38, 3, '2025-01-01 07:42:13', '2025-01-01 07:42:13'),
	(32, '22002376', 'Nguyễn Trung', 'Hiếu', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 39, 3, '2025-01-01 07:42:38', '2025-01-01 07:42:38'),
	(33, '22002345', 'Nguyễn Ngọc', 'Quốc Thông', '2025-01-01', 'Nam', '34 - 34A Nguyễn Bỉnh Khiêm, Phường 1, Quận Gò Vấp, TP. HCM', 1, 40, 3, '2025-01-01 07:43:03', '2025-01-01 07:43:03');

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

-- Dumping data for table database00.users: ~36 rows (approximately)
REPLACE INTO `users` (`id`, `username`, `password`, `role`, `gmail`, `phone`, `createdAt`, `updatedAt`, `active`) VALUES
	(1, 'admin', '$2b$10$6jMp5LqDK1evCv46dWT3RONdSdJ9m7BLDBOcRUuu8bq/T5R91tNOe', 'admin', '123123@gmail.com', '1111111111', '2024-12-27 00:01:01', '2024-12-27 00:01:14', 1),
	(2, '11002221', '$2b$10$wS375ac0kgJM3nod1Lkq6OTJyJsCk2dOUFJMV1IOt8p8Md1s/Fbyi', 'advisor', NULL, NULL, '2025-01-01 07:21:47', '2025-01-01 07:21:47', 1),
	(3, '11002222', '$2b$10$raJqfGjzww8ZYfEH8nPt5O4bCJHQSbQVI/94Jwv5HsM3XPId31PFC', 'advisor', NULL, NULL, '2025-01-01 07:22:57', '2025-01-01 07:22:57', 1),
	(4, '11002223', '$2b$10$Vcku6j32yIb1EWkCRInjW.HDaebqBfnNr88Qg3ga5Nt7dh5.KMLS6', 'advisor', NULL, NULL, '2025-01-01 07:23:30', '2025-01-01 07:23:30', 1),
	(5, '11002224', '$2b$10$.rxSHwEMEuDC2VIKMyruROahM.qPXAo9AX4hQ0U24kZ2nlxcSjlKW', 'advisor', NULL, NULL, '2025-01-01 07:24:00', '2025-01-01 07:24:00', 1),
	(6, '11002225', '$2b$10$dlsWZSEaACY8DlXTM5//Bes9O7q0jY39foUfFyMwe6i7i7uEqlzoW', 'advisor', NULL, NULL, '2025-01-01 07:24:25', '2025-01-01 07:24:25', 1),
	(7, '11002226', '$2b$10$MVqZ1esa/aPsGc4TzZddk.zOv0pN8Jbe4/e27wrudKg6cJn1oI0iO', 'advisor', NULL, NULL, '2025-01-01 07:25:00', '2025-01-01 07:25:00', 1),
	(8, '22001965', '$2b$10$UatrNxs8yI46HYyBV/pT.evdRc9Igjq.bYpDWjk/AK2faenROJocG', 'student', NULL, NULL, '2025-01-01 07:25:58', '2025-01-01 07:25:58', 1),
	(9, '22001970', '$2b$10$eVd7mdonbsyDV30HPX7BZuZXWduG30Pm/mrvqk.lqYiqYzy6rPcN2', 'student', NULL, NULL, '2025-01-01 07:26:29', '2025-01-01 07:26:29', 1),
	(10, '22001881', '$2b$10$.KIBjtbw/Pu4dV7uJdOoNO5hiyUfpY95kjbwpJYoJex0u8EJYyy1G', 'student', NULL, NULL, '2025-01-01 07:26:58', '2025-01-01 07:26:58', 1),
	(11, '22001795', '$2b$10$KeY1j5IKJEmokivQ5J1ig.sv2GyHKbsyAZPMeGxsuwZN5jVN8gHRm', 'student', NULL, NULL, '2025-01-01 07:27:25', '2025-01-01 07:27:25', 1),
	(12, '22002451', '$2b$10$rI8b5jtZTo5KNnFBoNiv8OzRlIdy16G6RW.JarIuoN6W6/Q7cfdja', 'student', NULL, NULL, '2025-01-01 07:27:55', '2025-01-01 07:27:55', 1),
	(13, '22000290', '$2b$10$.9tZVNC6Sx.Q3HPPBfNBveOk5gZGng4havytdUgn.xxOAWGI8VdpO', 'student', NULL, NULL, '2025-01-01 07:28:43', '2025-01-01 07:28:43', 1),
	(14, '22001460', '$2b$10$8Vua0PtM1ok/h0.atiCRiO5nNAL1goZ8yncdB/MN5nTLElJAya/LG', 'student', NULL, NULL, '2025-01-01 07:29:04', '2025-01-01 07:29:04', 1),
	(15, '22001599', '$2b$10$L4VF.qifSPuE/bmh0iBBkucUXsmtJXiHtuFLDxLRmWTj0Ug7ounyu', 'student', NULL, NULL, '2025-01-01 07:29:30', '2025-01-01 07:29:30', 1),
	(16, '22001846', '$2b$10$7JVsz.x1UxzSBGvf9Qeut.hYCnp8MWQWP7WqzcHQy/iaBzTBlJcfK', 'student', NULL, NULL, '2025-01-01 07:30:07', '2025-01-01 07:30:07', 1),
	(17, '22001976', '$2b$10$Faw3mgwaRXqjryTom1kmCehOAV6QxNKEGeGJkqTYQjGOfjM/1yhN.', 'student', NULL, NULL, '2025-01-01 07:30:41', '2025-01-01 07:30:41', 1),
	(18, '22002070', '$2b$10$VUCYNid5CIYcVtvLEDNLweunDnIDqd9XbTh1l8bYOZPqMJjUs/ePi', 'student', NULL, NULL, '2025-01-01 07:31:17', '2025-01-01 07:31:17', 1),
	(19, '22001786', '$2b$10$81mP.muZHvJoaYXy5wVZW.wSOHYynUvzwYSadeSoPRKYlpwtOAXZK', 'student', NULL, NULL, '2025-01-01 07:31:45', '2025-01-01 07:31:45', 1),
	(20, '22002398', '$2b$10$6frrg/RY9m4T/extGXmHAu5NX3Vqt.FjtaBWsRrysthR3jTk4DG3i', 'student', NULL, NULL, '2025-01-01 07:32:12', '2025-01-01 07:32:12', 1),
	(21, '22002240', '$2b$10$sivgvKFJwL4AXyHVNSan3.onZvwXU83fpQdiIYIl.zcQ8DYsSFjfK', 'student', NULL, NULL, '2025-01-01 07:32:37', '2025-01-01 07:32:37', 1),
	(22, '22001579', '$2b$10$UelDZomrhS4PDG.6SY6gK.P1WMdK1XOdbV2lV6ozPkpVpBZcEGqu2', 'student', NULL, NULL, '2025-01-01 07:33:18', '2025-01-01 07:33:18', 1),
	(23, '22002009', '$2b$10$G2XwaEc6YPDaPRx0op8MTO.V9UtOBqtY1Gtst4InsLJzbuPAhflF.', 'student', NULL, NULL, '2025-01-01 07:33:41', '2025-01-01 07:33:41', 1),
	(24, '22001666', '$2b$10$kNQuFAS2Es04u0IsBFNpmOET9gldRSGSXJDSUtJxYOkHGGwZjOnrW', 'student', NULL, NULL, '2025-01-01 07:34:16', '2025-01-01 07:34:16', 1),
	(25, '22001817', '$2b$10$YDtEgmqX5hzV1vPtzY3NQO/x4fpQFVWt62ul0vpMNZ680Zn0PW0HS', 'student', NULL, NULL, '2025-01-01 07:35:59', '2025-01-01 07:35:59', 1),
	(26, '22002085', '$2b$10$z1XDF5KqXuC.jV35wsq7U.IZSRY7802EyRJPpRbP3yAbpfvgVHwRe', 'student', NULL, NULL, '2025-01-01 07:36:35', '2025-01-01 07:36:35', 1),
	(27, '22002088', '$2b$10$E1Dao6F67VQobsKWt2UtWOl1Cl05G9rCZOvBbQhiKRaursNBOBv86', 'student', NULL, NULL, '2025-01-01 07:37:02', '2025-01-01 07:37:02', 1),
	(28, '22001445', '$2b$10$MlXsKinb2SPijeioMDTWB.5B7k9plVl2FVEpJXlqf42qUImP.hNaq', 'student', NULL, NULL, '2025-01-01 07:37:37', '2025-01-01 07:37:37', 1),
	(29, '22001501', '$2b$10$H1JrZDoU9E8j1ixBEMqNwOhlf4Wq5/eQQoSf0LQ16FkitdkPvGq7K', 'student', NULL, NULL, '2025-01-01 07:38:05', '2025-01-01 07:38:05', 1),
	(30, '22001909', '$2b$10$y3mKHPeM.nP/9OS8K8z28OFp4bVpDqx9pK7XUtLnwLpBMUHau0OZC', 'student', NULL, NULL, '2025-01-01 07:38:27', '2025-01-01 07:38:27', 1),
	(31, '22001963', '$2b$10$F6g6TwckcJmpMKEJ4Yo1dOZ0qfnqanIxF226/xmMJ9.UAAaiPWIsO', 'student', NULL, NULL, '2025-01-01 07:38:58', '2025-01-01 07:38:58', 1),
	(32, '22002094', '$2b$10$2F4kEFBmysalGncELlstKOffSF46oejKH6iBeIJAILINLCkRjyL6q', 'student', NULL, NULL, '2025-01-01 07:39:24', '2025-01-01 07:39:24', 1),
	(33, '22000214', '$2b$10$O1YR/x57kNzjOAPWusM2Ue60tklh4haEVslXABsfD6MhtQrCWwl02', 'student', NULL, NULL, '2025-01-01 07:39:48', '2025-01-01 07:39:48', 1),
	(34, '22002414', '$2b$10$RdMV.Aj8XGMXL3N.oCKqBe4reU9tsdJdUxUVPXfOjs/ub95WuaXWy', 'student', NULL, NULL, '2025-01-01 07:40:15', '2025-01-01 07:40:15', 1),
	(35, '22002415', '$2b$10$9uRSDRDfA9aNzGa07m2z0udTu1PyAoAaFseU5a9SrrHB4r4gxFMaa', 'student', NULL, NULL, '2025-01-01 07:40:36', '2025-01-01 07:40:36', 1),
	(36, '22000279', '$2b$10$6KF6JM0zJK4BQTvYSQQbiO0nCnnn0kHq4R4FflLEZ1/W95Yadg3W6', 'student', NULL, NULL, '2025-01-01 07:40:57', '2025-01-01 07:40:57', 1),
	(37, '22001816', '$2b$10$9SOs0QTmgmFwOft1Qt/qf.NAX/ns6anp5I9cBV/4IFbIm3TxqHiAK', 'student', NULL, NULL, '2025-01-01 07:41:23', '2025-01-01 07:41:23', 1),
	(38, '22002108', '$2b$10$laOK7YfA3mZbR4VVVDEsauuxmmfSfBlkBAWfu8a2ZT2ztj.6qIoDu', 'student', NULL, NULL, '2025-01-01 07:42:13', '2025-01-01 07:42:13', 1),
	(39, '22002376', '$2b$10$e.mJuWzu.RE8XDbWv03uG.bbhXc9PoSWtKM1Qz5ksk.6.GLKyRfnq', 'student', NULL, NULL, '2025-01-01 07:42:38', '2025-01-01 07:42:38', 1),
	(40, '22002345', '$2b$10$cLl/T.pO66yAbqmlMOM99.U9YGZl6I93LLWqkz3KoKwPd0FYQhURq', 'student', NULL, NULL, '2025-01-01 07:43:03', '2025-01-01 07:43:03', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
