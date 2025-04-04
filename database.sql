-- Create database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE
);

-- Create user with limited privileges
CREATE USER IF NOT EXISTS 'tosh'@'localhost' IDENTIFIED BY '#Toshlewi254';
GRANT INSERT, SELECT ON portfolio_db.contacts TO 'tosh'@'localhost';
FLUSH PRIVILEGES;

-- Optional: Create messages table for WebSQL sync
CREATE TABLE IF NOT EXISTS offline_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    date_sent DATETIME NOT NULL,
    is_synced BOOLEAN DEFAULT FALSE,
    sync_attempts INT DEFAULT 0,
    last_attempt TIMESTAMP NULL
);

-- Index for better performance
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_offline_sync_status ON offline_messages(is_synced);