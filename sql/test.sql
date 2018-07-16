/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.7.16-log : Database - test
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`test` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `test`;

/*Table structure for table `base` */

DROP TABLE IF EXISTS `base`;

CREATE TABLE `base` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'ID',
  `number` varchar(255) NOT NULL COMMENT '编码',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  `createUserId` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '创建者',
  `updateUserId` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '更新者',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `base` */

insert  into `base`(`id`,`number`,`name`,`description`,`createdAt`,`updatedAt`,`createUserId`,`updateUserId`) values ('1bd63ee0-8417-11e8-952d-77cc18624d8e','nbnbnb','bbb','dddd','2018-07-10 07:59:02','2018-07-12 16:01:29','1bd63ee0-8417-11e8-952d-77cc18624d8e','1bd63ee0-8417-11e8-952d-77cc18624d8e'),('b','nbnbnb','bbb','dddd','2018-07-11 17:04:35','2018-07-12 16:01:29','1bd63ee0-8417-11e8-952d-77cc18624d8e','1bd63ee0-8417-11e8-952d-77cc18624d8e');

/*Table structure for table `test` */

DROP TABLE IF EXISTS `test`;

CREATE TABLE `test` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'ID',
  `number` varchar(255) NOT NULL COMMENT '编码',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `createdAt` datetime NOT NULL COMMENT '创建时间',
  `updatedAt` datetime NOT NULL COMMENT '更新时间',
  `createUserId` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '创建者',
  `updateUserId` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '更新者',
  `baseId` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `test` */

insert  into `test`(`id`,`number`,`name`,`description`,`createdAt`,`updatedAt`,`createUserId`,`updateUserId`,`baseId`) values ('6cb6b423-2ec0-47b1-be02-b3f255c00f93','nbnbnb','nnnn',NULL,'2018-07-12 06:42:58','2018-07-12 06:55:36',NULL,NULL,NULL),('9447dc28-6f10-44a5-8c89-bd9cf14e0a3f','nbnbnb','nnnn','t-1531209976804','2018-07-10 08:06:16','2018-07-12 06:55:36','1bd63ee0-8417-11e8-952d-77cc18624d8e','1bd63ee0-8417-11e8-952d-77cc18624d8e','1bd63ee0-8417-11e8-952d-77cc18624d8e'),('a30a77eb-f83a-489c-b6fe-27a8a1d84542','nbnbnb','nnnn',NULL,'2018-07-12 06:48:42','2018-07-12 06:55:36',NULL,NULL,NULL),('bbf30ccc-9bc0-446b-8994-3b1d2fbc38af','nbnbnb','nnnn','t-1531209605735','2018-07-10 08:00:05','2018-07-12 06:55:36','1bd63ee0-8417-11e8-952d-77cc18624d8e','1bd63ee0-8417-11e8-952d-77cc18624d8e','1bd63ee0-8417-11e8-952d-77cc18624d8e');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
