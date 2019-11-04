CREATE TABLE `users` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(50) NOT NULL,
	`password` TINYTEXT NOT NULL,
	`display_name` TINYTEXT NOT NULL,
	`api_key` TINYTEXT NULL,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `username` (`email`)
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1
;


CREATE TABLE `path_meta` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`owner_id` INT(11) UNSIGNED NOT NULL,
	`name` TINYTEXT NULL,
	`first_point_time` DATETIME NOT NULL,
	`last_point_time` DATETIME NOT NULL,
	`point_count` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	`duration_seconds` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`),
	INDEX `FK_path_meta_users` (`owner_id`),
	CONSTRAINT `FK_path_meta_users` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COMMENT='Contains meta information about paths.'
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1
;


CREATE TABLE `locations` (
	`guid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`pathmeta_id` INT(11) UNSIGNED NOT NULL,
	`latitude` FLOAT NOT NULL,
	`longitude` FLOAT NOT NULL,
	`altitude` FLOAT NOT NULL DEFAULT '0',
	`speed` FLOAT NOT NULL DEFAULT '0',
	`accuracy` FLOAT NOT NULL DEFAULT '0',
	`time_gmt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`guid`),
	INDEX `FK_locations_path_meta` (`pathmeta_id`),
	CONSTRAINT `FK_locations_path_meta` FOREIGN KEY (`pathmeta_id`) REFERENCES `path_meta` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1
;
