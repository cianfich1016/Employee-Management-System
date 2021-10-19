const express = require('express');
const mysql = require('mysql2');
const figlet = require('figlet');
const inquirer = require ('inquirer');
require ('console.table');
const db = require("./db/connect.js")


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
    db.query('SELECT * FROM job_role', function (err, results) {
        if (err) throw err;
        console.log("");
        console.table(results);
        mainQuestions();
      });
};

const viewAllEmployees = () => {
    db.query('SELECT * FROM employee', function (err, results) {
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
                mainQuestions();
            }

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