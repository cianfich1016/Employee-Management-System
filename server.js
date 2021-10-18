const express = require('express');
const mysql = require('mysql2');
const figlet = require('figlet');
const inquirer = require ('inquirer');
const table = require ('console.table');

const mainQuestions = () => {
    return inquirer.prompt([
        {
          type: 'list',
          name: 'mainQuestion',
          message: 'What would you like to do?',
          choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role"]
        },
    ]);
}



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