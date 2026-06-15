SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS fitpro_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER DATABASE fitpro_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fitpro_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(32) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(80) NOT NULL,
  avatar VARCHAR(255),
  role ENUM('student', 'coach', 'admin') NOT NULL DEFAULT 'student',
  gender VARCHAR(20),
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  coach_id INT NOT NULL,
  title VARCHAR(120) NOT NULL,
  description TEXT,
  duration INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  max_capacity INT NOT NULL DEFAULT 1,
  schedule JSON NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'published',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_courses_coach FOREIGN KEY (coach_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  schedule_time DATETIME NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  note VARCHAR(500),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_bookings_course FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS body_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  body_fat DECIMAL(5,2),
  muscle DECIMAL(5,2),
  bmi DECIMAL(5,2) NOT NULL,
  record_date DATE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_body_metrics_user FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (phone, password_hash, nickname, avatar, role, gender, height, weight)
VALUES
('13800000001', '$2a$10$N3l5nJIBV147BsqidbT7QO3U28t5GK1R932GPvmKTyStLXO/pO4iK', '林佳', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop', 'student', 'female', 168, 58),
('13800000002', '$2a$10$N3l5nJIBV147BsqidbT7QO3U28t5GK1R932GPvmKTyStLXO/pO4iK', 'Coach Han', 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=160&h=160&fit=crop', 'coach', 'male', 182, 78),
('13800000003', '$2a$10$N3l5nJIBV147BsqidbT7QO3U28t5GK1R932GPvmKTyStLXO/pO4iK', 'FitPro Admin', NULL, 'admin', 'other', NULL, NULL)
ON DUPLICATE KEY UPDATE nickname = VALUES(nickname);

INSERT INTO courses (coach_id, title, description, duration, price, max_capacity, schedule, status)
VALUES
(2, '晨间力量唤醒', '小班力量训练，聚焦核心激活与动作模式校准。', 60, 188.00, 6, JSON_ARRAY('2026-06-16T08:00:00+08:00','2026-06-18T08:00:00+08:00'), 'published'),
(2, '体态矫正私教', '肩颈、髋膝踝评估后定制动作方案。', 45, 260.00, 1, JSON_ARRAY('2026-06-16T19:00:00+08:00','2026-06-19T19:30:00+08:00'), 'published')
ON DUPLICATE KEY UPDATE title = VALUES(title);
