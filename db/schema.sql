DROP DATABASE IF EXISTS  employee_db;
CREATE DATABASE employee_db;

USE employee_db;

DROP TABLE IF EXISTS department;
CREATE TABLE department (
    id INT PRIMARY KEY NOT NULL,
    department_name VARCHAR(30) NOT NULL
);

DROP TABLE IF EXISTS role_name;
CREATE TABLE role_name (
    id INT PRIMARY KEY NOT NULL,
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL
);

DROP TABLE IF EXISTS employee;
CREATE TABLE employee(
    id INT PRIMARY KEY NOT NULL,
    first_name VARCHAR(30) NOT NULL, 
    last_name DECIMAL NOT NULL,
    role_id INT NOT NULL,
    manager_id INT
);


