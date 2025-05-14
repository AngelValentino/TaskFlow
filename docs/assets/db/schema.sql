-- DROP TABLES
SET FOREIGN_KEY_CHECKS = 0; -- Disable foreign key checks

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS quotes;
DROP TABLE IF EXISTS user_logs;

SET FOREIGN_KEY_CHECKS = 1; -- Re-enable foreign key checks

-- DROP TRIGGERS
DROP TRIGGER IF EXISTS log_user_inserts;
DROP TRIGGER IF EXISTS log_user_updates;
DROP TRIGGER IF EXISTS log_user_deletes;

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE table refresh_tokens (
    token_hash VARCHAR(64) NOT NULL,
    expires_at INT UNSIGNED NOT NULL,
    PRIMARY KEY (token_hash)
);

CREATE TABLE tasks (
    id INT UNSIGNED AUTO_INCREMENT,
    user_id INT UNSIGNED,
    title VARCHAR(75) NOT NULL,
    due_date DATE NOT NULL,
    `description` VARCHAR(500),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at DATE DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE quotes (
    id INT UNSIGNED AUTO_INCREMENT,
    quote VARCHAR(500) NOT NULL,
    author VARCHAR(75) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE user_logs (
    id INT UNSIGNED AUTO_INCREMENT,
    `type` ENUM('insert', 'update', 'delete') NOT NULL,
    old_username VARCHAR(20),
    new_username VARCHAR(20),
    old_password VARCHAR(255),
    new_password VARCHAR(255),
    action_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

-- ADD TRIGGERS
DELIMITER $$

CREATE TRIGGER log_user_inserts
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO user_logs (`type`, old_username, new_username, old_password, new_password)
    VALUES ('insert', NULL, NEW.username, NULL, NEW.password_hash);
END $$

CREATE TRIGGER log_user_updates
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF OLD.username != NEW.username OR OLD.password_hash != NEW.password_hash THEN
        INSERT INTO user_logs (`type`, old_username, new_username, old_password, new_password)
        VALUES ('update', OLD.username, NEW.username, OLD.password_hash, NEW.password_hash);
    END IF;
END $$

CREATE TRIGGER log_user_deletes
AFTER DELETE ON users
FOR EACH ROW
BEGIN
    INSERT INTO user_logs (`type`, old_username, new_username, old_password, new_password)
    VALUES ('delete', OLD.username, NULL, OLD.password_hash, NULL);
END $$

DELIMITER ;