//Import and require appropriate packages
const express = require('express');
const mysql = require('mysql2');
const figlet = require('figlet');
const inquirer = require ('inquirer');
const util = require('util');
require ('console.table');
const db = require("./db/connect.js");

db.queryPromise = util.promisify(db.query);

//Main menu prompt
const mainQuestions = () => {
    inquirer.prompt([
        {
          type: 'list',
          name: 'mainQuestions',
          message: 'What would you like to do?',
          choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Delete a Department", "Exit"]
        },
        //Determine which function needs to be called based on user answer choice
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
        } else if (data.mainQuestions === "Update an Employee"){
            updateEmployee();
        } else if (data.mainQuestions === "Exit") {
            quit();
        }
    });
};

const viewAllDepartments = () => {
    //Select all from the department table and display as a formatted table
    db.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        console.log("");
        console.table(results);
        mainQuestions();
      });  
};

const viewAllRoles = () => {
    //Select specific parameters from the job_role and department table and join them together from left (job_role then department) for the all role table and display as a formatted table
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
    //Ask for which department name to insert from user input
    inquirer.prompt([
        {
          type: 'input',
          name: 'department_name',
          message: 'What is the name of the department you would like to add?',
        },
    ]).then((data) => {
        //Query to insert user input to department table  
        const sql = `INSERT INTO department (department_name) 
            VALUES (?)`;
        //What user wants to input
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
    //Select all from department table
    db.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        //Inquirer questions to determine parameters of job_role table that need be added for new role
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
                //Return choices from department table to list all of departments when choosing what department the role would belong to
                choices: () => {
                    const departList =[];
                    for (let i = 0; i < results.length; i++){
                        departList.push(results[i].department_name)
                    }
                    return departList;
                }
            },
        ]).then((data) => {
            //Query to insert input into job_role table
            const sql = `INSERT INTO job_role (title, salary, department_id) 
                VALUES (?, ?, ?)`;
            //Creating a way to return the department id of the department user said role was a part of
            let departID = '';
            //Loop through results to determine where the user text input matches an id number and return that to the variable departID.
            for (let i = 0; i < results.length; i++){
                if (results[i].department_name === data.department_id){
                    departID = results[i].id;       
                }
            };
            //Create new parameter to input in for query to add a role
            let param = [data.title, data.salary, departID]
            db.query(sql, param, (err, results) => {
                if (err) {
                console.log(err)
                return;
                } else {
                    console.log ("Added your role to the database.")
                    mainQuestions();
                }
            });
        });
    });
};

const addEmployee = async () => {
    //Select all from the table job_role to be used to show roles for user to choose from.
    let roles = await db.queryPromise('SELECT * FROM job_role');

    roles = roles.map(role => {
        return {
            key: role.id,
            value: role.title,
        };
    });

    let employees = await db.queryPromise('SELECT * FROM employee');

    employees = employees.map(employee => {
        return {
            key: employee.id,
            value: employee.first_name + " " + employee.last_name,
        };
    });

    employees.push({key: -1,
        value: "No Manager"})

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
            choices: () => roles,
        },
        {
            type: 'list',
            name: 'manager_name',
            message: 'Who will be his/her manager?',
            choices: () => employees,
                
        },
    ]).then((data) => {
        if (data.manager_name === "No Manager"){
            let sql = `INSERT INTO employee (first_name, last_name, job_role_id, manager_id) 
            VALUES (?, ?, ?, NULL)`
            for (let i = 0; i< roles.length; i++){
                if (data.job_role_name === roles[i].value){
                    rKey = roles[i].key;
                }
                if (data.manager_name === employees[i].value){
                    mKey = employees[i].key;
                }
            }
            const param = [data.first_name, data.last_name, rKey, null]
            db.query(sql, param, (err, results) => {
                if (err) {
                    console.log(err)
                    return;
                } else {
                    mainQuestions();
                }
        
        });
        } else {
            let sql = `INSERT INTO employee (first_name, last_name, job_role_id, manager_id) 
            VALUES (?, ?, ?, ?)`;
            for (let i = 0; i< roles.length; i++){
                if (data.job_role_name === roles[i].value){
                    rKey = roles[i].key;
                }
                if (data.manager_name === employees[i].value){
                    mKey = employees[i].key;
                }
            }
            const param = [data.first_name, data.last_name, rKey, mKey]
            db.query(sql, param, (err, results) => {
            if (err) {
            console.log(err)
            return;
            } else {
                mainQuestions();
            }
        
        });
        }
        
        
    });
};

//If user selects "Exit" from  main menu questions
const quit = () => {
    console.log("See you next time!");
    process.exit();
}

//Opening text art
const startProgram = () => {
    console.log(figlet.textSync("Employee"))
    console.log(figlet.textSync("Manager"))
    console.log(figlet.textSync("System"))
};

//Begin application
const init = () => {
    startProgram(); 
    mainQuestions();
 };

 //Call to begin application
init();