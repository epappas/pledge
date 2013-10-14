CREATE TABLE `user` (
	`id`          INT UNSIGNED              NULL AUTO_INCREMENT,
	`ukey`        VARCHAR(32)               NULL,
	`email`       VARCHAR(255)              NULL,
	`uname`       VARCHAR(100)              NULL,
	`pass`        VARCHAR(32)               NULL,
	`seed`        VARCHAR(10)               NULL,
	`settings`    TEXT                      NULL,
	`status`      INT(1) UNSIGNED ZEROFILL  NULL,
	`registered`  INT(11) UNSIGNED ZEROFILL NULL,
	`last_active` INT(11) UNSIGNED ZEROFILL NULL,
	PRIMARY KEY (`id`),
	UNIQUE INDEX (`id`),
	UNIQUE INDEX (`ukey`),
	INDEX (`email`),
	INDEX (`uname`)
)
	ENGINE =InnoDB
	DEFAULT CHARACTER SET =utf8
	COLLATE =utf8_general_ci;

CREATE TABLE `email_alias` (
	`id`        INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`alias_key` VARCHAR(32) DEFAULT NULL,
	`email`     VARCHAR(255) DEFAULT NULL,
	`alias`     VARCHAR(255) DEFAULT NULL,
	`status`    INT(1) UNSIGNED ZEROFILL DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `id` (`id`),
	UNIQUE KEY `alias_key` (`alias_key`),
	KEY `email` (`email`),
	KEY `email_2` (`email`, `status`)
)
	ENGINE =InnoDB
	DEFAULT CHARSET =utf8;

CREATE TABLE `user_interactions` (
	`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`uid` int(11) unsigned DEFAULT NULL,
	`time` int(11) unsigned DEFAULT NULL,
	`targetid` int(11) unsigned DEFAULT NULL,
	`target` varchar(20) DEFAULT NULL,
	`type` int(2) unsigned DEFAULT NULL,
	`value` text,
	PRIMARY KEY (`id`),
	UNIQUE KEY `id` (`id`) USING HASH,
	KEY `uid` (`uid`) USING HASH,
	KEY `time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;