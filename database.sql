-- Create database and tables
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a table to store downloadable CV metadata
CREATE TABLE IF NOT EXISTS downloadable_cv (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user with minimal privileges
CREATE USER IF NOT EXISTS 'portfolio_js'@'localhost' IDENTIFIED BY 'JsSecurePass123!';
GRANT INSERT, SELECT ON portfolio_db.contacts TO 'portfolio_js'@'localhost';
FLUSH PRIVILEGES;



-- Query to test the database and table
USE portfolio_db;

-- Insert a sample record into the contacts table
INSERT INTO contacts (name, email, message) 
VALUES ('John Doe', 'john.doe@example.com', 'This is a test message.');

-- Insert metadata for the CV file
INSERT INTO downloadable_cv (file_name, file_path) 
VALUES ('my resume.pdf', '/path/to/my resume.pdf');

-- Select all records from the contacts table
SELECT * FROM contacts;

-- Query to retrieve the CV metadata
SELECT * FROM downloadable_cv;