CREATE DATABASE trioSports;
USE trioSports;

-- DROP DATABASE trioSports;

CREATE TABLE user (
	user_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATETIME,
    gender VARCHAR(50),  
    user_img VARCHAR(200),
    user_city VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    last_log_date DATETIME NOT NULL,  -- se tiene que actualizar en cada login
    is_validated BOOLEAN NOT NULL default 0,
    is_disabled BOOLEAN NOT NULL default 0,
    type TINYINT NOT NULL default 2 -- 1 - admin | 2 - user
);

CREATE TABLE message (
    message_id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    text TINYTEXT NOT NULL,
    date_time DATETIME NOT NULL DEFAULT current_timestamp,
    sender_user_id INT UNSIGNED NOT NULL,
    receiver_user_id INT UNSIGNED NOT NULL,
    opened BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_sender_user FOREIGN KEY (sender_user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_receiver_user FOREIGN KEY (receiver_user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE sport (
	sport_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    sport_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE practice (
	sport_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
	PRIMARY KEY (sport_id,user_id),
    CONSTRAINT fk_practice_sport FOREIGN KEY (sport_id) REFERENCES sport (sport_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_practice_user FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE activity (
	activity_id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    date_time_activity DATETIME NOT NULL,
    limit_users INT,  -- null: senderismo | 4: tenis o pádel | 10: baloncesto
    text VARCHAR(255) NOT NULL,
    activity_city VARCHAR(50) NOT NULL,
    details TINYTEXT,
    user_id INT UNSIGNED NOT NULL,
    sport_id INT UNSIGNED NOT NULL,
    maps_link VARCHAR(350),
    -- num_asistentes - > usuarios que se han apuntado
    -- disabled  -> el admin deshabilita una actividad
	CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_activity_sport FOREIGN KEY (sport_id) REFERENCES sport (sport_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE participate (
	activity_id BIGINT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    date_time_participate DATETIME NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (user_id,activity_id),
    CONSTRAINT fk_participate_activity FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_participate_user FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE comment (
	activity_id BIGINT UNSIGNED NOT NULL,
	comment_id MEDIUMINT UNSIGNED NOT NULL ,
	user_id INT UNSIGNED NOT NULL,
    text TINYTEXT NOT NULL,
    PRIMARY KEY (comment_id,activity_id),
    CONSTRAINT fk_comment_activity FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
    
    
    
    
