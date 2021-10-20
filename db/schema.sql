--Delete database if exists and create new--
DROP DATABASE IF EXISTS  employee_db;
CREATE DATABASE employee_db;

--Use this database--
USE employee_db;

--Delete table if exists and create table with two parameters id and department_name and primary key id--
DROP TABLE IF EXISTS department;
CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

--Delete table if exists and create table with four parameters id, title, salary, department_id--
--Primary key is id--
--Foreign key is department_id using the id from department table--
DROP TABLE IF EXISTS job_role;
CREATE TABLE job_role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id)
    REFERENCES department (id)
);

--Delete table if exists and create table with five parameters id, first_name, last_name, job_role_id, and manager_id--
--Primary key is id--
--Foreign keys are both the job_role_id using the id from the job_role table and manager_id 
DROP TABLE IF EXISTS employee;
CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL,
    job_role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (job_role_id) REFERENCES job_role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);


