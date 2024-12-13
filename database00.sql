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
  `majorsID` int NOT NULL,
  `userID` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `advisorID` (`advisorID`),
  KEY `majorsID` (`majorsID`),
  KEY `userID` (`userID`),
  CONSTRAINT `advisors_ibfk_1` FOREIGN KEY (`majorsID`) REFERENCES `majors` (`id`),
  CONSTRAINT `advisors_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.advisors: ~1 rows (approximately)
REPLACE INTO `advisors` (`id`, `advisorID`, `lastname`, `firstname`, `date_of_birth`, `gender`, `majorsID`, `userID`, `createdAt`, `updatedAt`) VALUES
	(1, 'GV19772', 'Trần Thành', 'Giang', '1977-12-12', 'Nam', 1, 3, '2024-12-06 15:23:54', '2024-12-06 15:23:54');

-- Dumping structure for table database00.class
DROP TABLE IF EXISTS `class`;
CREATE TABLE IF NOT EXISTS `class` (
  `id` int NOT NULL AUTO_INCREMENT,
  `classID` varchar(20) NOT NULL,
  `status` enum('active','inactive') NOT NULL,
  `majorsID` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `classID` (`classID`),
  KEY `majorsID` (`majorsID`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`majorsID`) REFERENCES `majors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.class: ~2 rows (approximately)
REPLACE INTO `class` (`id`, `classID`, `status`, `majorsID`, `createdAt`, `updatedAt`) VALUES
	(1, '22CPM01', 'active', 1, '2024-12-06 15:20:20', '2024-12-06 15:20:20'),
	(2, '22QTM01', 'active', 2, '2024-12-06 15:20:41', '2024-12-06 15:20:41'),
	(3, '22TMDT01', 'active', 3, '2024-12-06 15:20:55', '2024-12-06 15:20:55');

-- Dumping structure for table database00.files
DROP TABLE IF EXISTS `files`;
CREATE TABLE IF NOT EXISTS `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_path` text NOT NULL,
  `uploaded_by` int NOT NULL,
  `uploaded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.majors: ~2 rows (approximately)
REPLACE INTO `majors` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
	(1, 'Ứng dụng phần mềm', '2024-12-06 15:13:42', '2024-12-06 15:13:42'),
	(2, 'Quản trị mạng', '2024-12-06 15:13:58', '2024-12-06 15:13:58'),
	(3, 'Thương mại điện tử', '2024-12-06 15:14:18', '2024-12-06 15:14:18');

-- Dumping structure for table database00.projectfeedback
DROP TABLE IF EXISTS `projectfeedback`;
CREATE TABLE IF NOT EXISTS `projectfeedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
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
  `field` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('not_started','in_progress','completed') DEFAULT 'not_started',
  `advisorID` int NOT NULL,
  `majorID` int NOT NULL,
  `fileID` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `advisorID` (`advisorID`),
  KEY `majorID` (`majorID`),
  KEY `fileID` (`fileID`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`advisorID`) REFERENCES `advisors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`majorID`) REFERENCES `majors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `projects_ibfk_3` FOREIGN KEY (`fileID`) REFERENCES `files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.projects: ~0 rows (approximately)
REPLACE INTO `projects` (`id`, `title`, `description`, `field`, `start_date`, `end_date`, `status`, `advisorID`, `majorID`, `fileID`, `createdAt`, `updatedAt`) VALUES
	(1, 'Ứng dụng quản lý đồ án khoa công nghệ thông tin Cao đẳng Bách Khoa Sài Gòn', 'Ứng dụng cung cấp môi trường làm quản thích hợp trong việc quản lý đồ án tốt nghiệp của khoa công nghệ thông tin\r\nHỗ trợ sinh viên, đăng ký, đăng tải, báo cáo tiến độ đề tài\r\nHỗ trợ giảng viên theo dõi, đánh giá, xem xét đề tài, theo dõi tiến độ đề tài', 'Công nghệ phần mềm', '2024-12-06', NULL, 'not_started', 1, 1, NULL, '2024-12-06 15:28:12', '2024-12-06 15:29:49'),
	(2, 'Web kinh doanh giày dép OA-Shop', 'Đăng bán sản phẩm, quảng bá, giới thiệu các mẫu giày mới, thực hiện mua sắm giày dép online ', 'Công nghệ phần mềm', '2024-12-07', NULL, 'not_started', 1, 1, NULL, '2024-12-07 15:23:34', '2024-12-07 15:23:34');

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
	(1, 1, '2024-12-06 15:30:07', '2024-12-06 15:30:07'),
	(1, 2, '2024-12-06 15:33:45', '2024-12-06 15:33:45'),
	(1, 3, '2024-12-06 15:33:51', '2024-12-06 15:33:51');

-- Dumping structure for table database00.students
DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentID` varchar(10) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('Nam','Nữ','Khác') NOT NULL,
  `majorsID` int NOT NULL,
  `usersID` int NOT NULL,
  `classID` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `studentID` (`studentID`),
  KEY `majorsID` (`majorsID`),
  KEY `usersID` (`usersID`),
  KEY `FK_students_class` (`classID`),
  CONSTRAINT `FK_students_class` FOREIGN KEY (`classID`) REFERENCES `class` (`id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`majorsID`) REFERENCES `majors` (`id`),
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`usersID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.students: ~3 rows (approximately)
REPLACE INTO `students` (`id`, `studentID`, `lastname`, `firstname`, `date_of_birth`, `gender`, `majorsID`, `usersID`, `classID`, `createdAt`, `updatedAt`) VALUES
	(1, '22001976', 'Trần Nguyên', 'Phát', '2004-07-27', 'Nam', 1, 1, 1, '2024-12-06 15:21:45', '2024-12-06 15:21:45'),
	(2, '22001977', 'Nguyễn Văn', 'A', '2024-12-06', 'Nam', 1, 5, 1, '2024-12-06 15:32:45', '2024-12-06 15:32:45'),
	(3, '22001978', 'Huỳnh Thị', 'B', '2024-12-06', 'Nữ', 1, 4, 1, '2024-12-06 15:33:32', '2024-12-06 15:33:32');

-- Dumping structure for table database00.suggestedprojects
DROP TABLE IF EXISTS `suggestedprojects`;
CREATE TABLE IF NOT EXISTS `suggestedprojects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.suggestedprojects: ~2 rows (approximately)
REPLACE INTO `suggestedprojects` (`id`, `title`) VALUES
	(1, 'Ứng dụng quản lý nhà hàng tiệc cưới Mặt Trời Mới'),
	(2, 'Giải pháp thiết kế hệ thống mạng trường Cao đẳng Bách Khoa Sài Gòn'),
	(3, 'Đánh giá hiệu quả của các chiến lược tiếp thị số trong kinh doanh thương mại điện tử ');

-- Dumping structure for table database00.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','advisor','admin') NOT NULL,
  `gmail` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `gmail` (`gmail`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table database00.users: ~5 rows (approximately)
REPLACE INTO `users` (`id`, `username`, `password`, `role`, `gmail`, `phone`, `createdAt`, `updatedAt`, `active`) VALUES
	(1, 'Kem', '$2b$12$CDzI29.pvU6R7hm5TRm2durrollNLhh/airN05Ppxb2vm3WD8q4Xm', 'student', 'kem123@gmail.com', '0374216499', '2024-12-06 15:15:40', '2024-12-06 15:15:40', 1),
	(2, 'admin', '$2b$12$CDzI29.pvU6R7hm5TRm2durrollNLhh/airN05Ppxb2vm3WD8q4Xm', 'admin', 'admin@gmail.com', '1111111111', '2024-12-06 15:16:29', '2024-12-06 15:16:29', 1),
	(3, 'advisor', '$2b$12$CDzI29.pvU6R7hm5TRm2durrollNLhh/airN05Ppxb2vm3WD8q4Xm', 'advisor', 'advisor@gmail.com', '2222222222', '2024-12-06 15:17:02', '2024-12-06 15:17:02', 1),
	(4, 'Susu', '$2b$12$CDzI29.pvU6R7hm5TRm2durrollNLhh/airN05Ppxb2vm3WD8q4Xm', 'student', 'susu123@gmail.com', '0559391049', '2024-12-06 15:31:05', '2024-12-06 15:31:05', 1),
	(5, 'SuaDua', '$2b$12$CDzI29.pvU6R7hm5TRm2durrollNLhh/airN05Ppxb2vm3WD8q4Xm', 'student', 'suadua123@gmail.com', '0374368872', '2024-12-06 15:32:00', '2024-12-06 15:32:00', 1);

/*mk: 123123*/
/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
