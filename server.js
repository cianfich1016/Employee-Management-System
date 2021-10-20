const express = require('express');
const mysql = require('mysql2');
const figlet = require('figlet');
const inquirer = require ('inquirer');
require ('console.table');
const db = require("./db/connect.js");
const { listenerCount } = require('./db/connect.js');


const mainQuestions = () => {
    inquirer.prompt([
        {
          type: 'list',
          name: 'mainQuestions',
          message: 'What would you like to do?',
          choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Exit"]
        },
    ]).then((data) => {
        if (data.mainQuestions === "View All Departments"){
            viewAllDepartments(); 
        } else if (data.mainQuestions === "View All Roles") {
            viewAllRoles();
        } else if (data.mainQuestions === "View All Employees") {
            viewAllEmployees ();   
        } else if (data.mainQuestions === "Add a Department"){
            addDepartment ();
        } else if (data.mainQuestions === "Add a Role"){
            addRole ();
        } else if (data.mainQuestions === "Add an Employee") {
            addEmployee();
        }
    });
};

const viewAllDepartments = () => {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        console.log("");
        console.table(results);
        mainQuestions();
      });
    
    
};

const viewAllRoles = () => {
    db.query('SELECT job_role.id, job_role.title, department.department_name, job_role.salary FROM job_role LEFT JOIN department ON job_role.department_id = department.id', function (err, results) {
        if (err) throw err;
        console.log("");
        console.table(results);
        mainQuestions();
      });
};

const viewAllEmployees = () => {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, job_role.title, job_role.salary FROM employee LEFT JOIN job_role ON employee.job_role_id = job_role.id', function (err, results) {
        if (err) throw err;
        console.log("");
        console.table(results);
        mainQuestions();
      });
};

const addDepartment = () => {
    inquirer.prompt([
        {
          type: 'input',
          name: 'department_name',
          message: 'What is the name of the department you would like to add?',
        },
    ]).then((data) => {
        const sql = `INSERT INTO department (department_name) 
            VALUES (?)`;
        const param = data.department_name;
        db.query(sql, param, (err, result) => {
            if (err) {
              console.log(err)
              return;
            } else {
                console.log ("Added your department to the database.")
                mainQuestions();
            }

        });
    });
};

const addRole = () => {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
            type: 'input',
            name: 'title',
            message: 'What is the name of the role you would like to add?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'What department does the role belong to?',
                choices: () => {
                    const departList =[];
                    for (let i = 0; i < results.length; i++){
                        departList.push(results[i].department_name)
                    }
                    return departList;
                }
            },
        ]).then((data) => {
            const sql = `INSERT INTO job_role (title, salary, department_id) 
                VALUES (?, ?, ?)`;
            let departID = '';
            for (let i = 0; i < results.length; i++){
                if (results[i].department_name === data.department_id){
                    departID = results[i].id;       
                }
            };
            let param = [data.title, data.salary, departID]
            db.query(sql, param, (err, results) => {
                if (err) {
                console.log(err)
                return;
                } else {
                    mainQuestions();
                }

            });
        });
    });
};

const addEmployee = () => {
    db.query('SELECT * FROM job_role', function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee to be added?',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the last name of the employee to be added?',
            },
            {
                type: 'list',
                name: 'job_role_name',
                message: 'What role does the employee have?',
                choices: () => {
                    const roleList =[];
                    for (let i = 0; i < results.length; i++){
                        roleList.push(results[i].title)
                    }
                    return roleList;
                }
            },
            {
                type: 'list',
                name: 'manager_name',
                message: 'Who will be his/her manager?',
                choices: () => {
                    const employeeList = [];
                    for (let i = 0; i < results.length; i++){
                        employeeList.push(results[i].first_name, results[i].last_name)
                        employeeList.join();
                    }
                    return employeeList;
                }
            },
        ]).then((data) => {
            const sql = `INSERT INTO employee (first_name, last_name, job_role_id, manager_id) 
                VALUES (?, ?, ?, ?)`;
            let roleID = '';
            for (let i = 0; i < results.length; i++){
                if (results[i].title === data.job_role_name){
                    roleID = results[i].id;       
                }
            };
            
            const param = [data.first_name, data.last_name, roleID]
            console.log(param)
            db.query(sql, param, (err, results) => {
                if (err) {
                console.log(err)
                return;
                } else {
                    mainQuestions();
                }

            });
        });
    });
};

const startProgram = () => {
    console.log(figlet.textSync("Employee"))
    console.log(figlet.textSync("Manager"))
    console.log(figlet.textSync("System"))
};

const init = () => {
    startProgram(); 
    mainQuestions();
 };

init();