-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: eum.cpvu0zdhrhoc.ap-northeast-2.rds.amazonaws.com    Database: lecture-service
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `exam_question_submissions`
--

DROP TABLE IF EXISTS `exam_question_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_question_submissions` (
  `exam_question_submission_id` bigint NOT NULL AUTO_INCREMENT,
  `exam_submission_id` bigint NOT NULL,
  `question_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `exam_solution` text,
  PRIMARY KEY (`exam_question_submission_id`),
  KEY `FK97h8aff4u63m0oj33dbgd2xbn` (`exam_submission_id`),
  CONSTRAINT `FK97h8aff4u63m0oj33dbgd2xbn` FOREIGN KEY (`exam_submission_id`) REFERENCES `exam_submissions` (`exam_submission_id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam_questions`
--

DROP TABLE IF EXISTS `exam_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_questions` (
  `exam_question_id` bigint NOT NULL AUTO_INCREMENT,
  `exam_id` bigint NOT NULL,
  `question_id` bigint NOT NULL,
  PRIMARY KEY (`exam_question_id`),
  KEY `exam_id` (`exam_id`),
  CONSTRAINT `exam_questions_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam_submissions`
--

DROP TABLE IF EXISTS `exam_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_submissions` (
  `exam_submission_id` bigint NOT NULL AUTO_INCREMENT,
  `exam_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `score` double DEFAULT NULL,
  `correct_count` bigint DEFAULT NULL,
  `total_count` bigint DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`exam_submission_id`),
  KEY `exam_id` (`exam_id`),
  CONSTRAINT `exam_submissions_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `exam_id` bigint NOT NULL AUTO_INCREMENT,
  `lecture_id` bigint NOT NULL,
  `title` varchar(100) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`exam_id`),
  KEY `lecture_id` (`lecture_id`),
  CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`lecture_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `homework_question_submissions`
--

DROP TABLE IF EXISTS `homework_question_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homework_question_submissions` (
  `homework_question_submission_id` bigint NOT NULL AUTO_INCREMENT,
  `homework_submission_id` bigint NOT NULL,
  `question_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `homework_solution` text,
  PRIMARY KEY (`homework_question_submission_id`),
  KEY `homework_submission_id` (`homework_submission_id`),
  CONSTRAINT `homework_question_submissions_ibfk_1` FOREIGN KEY (`homework_submission_id`) REFERENCES `homework_submissions` (`homework_submission_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `homework_questions`
--

DROP TABLE IF EXISTS `homework_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homework_questions` (
  `homework_question_id` bigint NOT NULL AUTO_INCREMENT,
  `homework_id` bigint NOT NULL,
  `question_id` bigint NOT NULL,
  PRIMARY KEY (`homework_question_id`),
  KEY `homework_id` (`homework_id`),
  CONSTRAINT `homework_questions_ibfk_1` FOREIGN KEY (`homework_id`) REFERENCES `homeworks` (`homework_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `homework_submissions`
--

DROP TABLE IF EXISTS `homework_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homework_submissions` (
  `homework_submission_id` bigint NOT NULL AUTO_INCREMENT,
  `homework_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `score` double DEFAULT NULL,
  `correct_count` bigint DEFAULT NULL,
  `total_count` bigint DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`homework_submission_id`),
  KEY `homework_id` (`homework_id`),
  CONSTRAINT `homework_submissions_ibfk_1` FOREIGN KEY (`homework_id`) REFERENCES `homeworks` (`homework_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `homeworks`
--

DROP TABLE IF EXISTS `homeworks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homeworks` (
  `homework_id` bigint NOT NULL AUTO_INCREMENT,
  `lecture_id` bigint NOT NULL,
  `title` varchar(100) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`homework_id`),
  KEY `lecture_id` (`lecture_id`),
  CONSTRAINT `homeworks_ibfk_1` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`lecture_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lecture_schedules`
--

DROP TABLE IF EXISTS `lecture_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecture_schedules` (
  `schedule_id` bigint NOT NULL AUTO_INCREMENT,
  `lecture_id` bigint NOT NULL,
  `day` varchar(10) NOT NULL,
  `period` bigint NOT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `lecture_id` (`lecture_id`),
  CONSTRAINT `lecture_schedules_ibfk_1` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`lecture_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=189 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lectures`
--

DROP TABLE IF EXISTS `lectures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lectures` (
  `lecture_id` bigint NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `introduction` text,
  `subject` varchar(50) NOT NULL,
  `background_color` varchar(20) NOT NULL,
  `font_color` varchar(20) NOT NULL,
  `year` bigint NOT NULL,
  `semester` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `lecture_status` bit(1) NOT NULL,
  PRIMARY KEY (`lecture_id`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lesson_questions`
--

DROP TABLE IF EXISTS `lesson_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_questions` (
  `lesson_question_id` bigint NOT NULL AUTO_INCREMENT,
  `lesson_id` bigint NOT NULL,
  `question_id` bigint NOT NULL,
  PRIMARY KEY (`lesson_question_id`),
  KEY `lesson_id` (`lesson_id`),
  CONSTRAINT `lesson_questions_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `lesson_id` bigint NOT NULL AUTO_INCREMENT,
  `lecture_id` bigint NOT NULL,
  `title` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`lesson_id`),
  KEY `lecture_id` (`lecture_id`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`lecture_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notices` (
  `notice_id` bigint NOT NULL AUTO_INCREMENT,
  `lecture_id` bigint NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`notice_id`),
  KEY `lecture_id` (`lecture_id`),
  CONSTRAINT `notices_ibfk_1` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`lecture_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-19 10:44:27
