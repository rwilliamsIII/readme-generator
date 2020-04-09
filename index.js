const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

function userInput(){
    inquirer
    .prompt([
        {
            type: "input",
            message: "What is your github username?",
            name: "username"
        },
        {
            type: "input",
            message: "What is your project name?",
            name: "projectName"
        },
        {
            type: "input",
            message: "What does your project do?",
            name: "description"
        },
        {
            type: "input",
            message: "How would a user install your project?",
            name: "installation"
        },
        {
            type: "checkbox",
            message: "What technologies did you use?",
            choices: ["Javascript", "Node.JS", "jQuery", "React.js", "GitHUB", "GIT", "Express", "MySQL", "React"],
            name: "technologies"
        },
        {
            type: "input",
            message: "Who are the contributors?",
            name: "contributors"
        },
        {
            type: "list",
            message: "Select the license you used.",
            choices: ["MIT", "ISC", "Apache", "BSD", "GPL"],
            name: "license"
        },
        {
            type: "input",
            message: "Enter your linkedIN url.",
            name: "linkedin"
        },
        {
            type: "input",
            message: "Enter the live link for your project.",
            name: "livelink"
        }
    ])
    .then(function (response){
        let userInfo = response.username;

        apiCall(userInfo, response);
    });
}

userInput();

function apiCall(userInfo, response){
    console.log(userInfo);
    const queryUrl = "https://api.github.com/users/" + userInfo;

    axios
    .get(queryUrl,
        {
            headers: {"Authorization": `token ${process.env.GH_Token}`}
        })
        .then(function(resp){

            console.log(resp.data);
            createMD(resp, response);

        }).catch(function(err){

            console.log(err);

        });
}

function createMD(resp, response){
    const readMeInfo = `
    <img id="license" src="https://img.shields.io/badge/License-${response.license}-blueviolet">
    <br style="line-height: 12px">
    <img src="${resp.data.avatar_url}" style= "width: 200px; height: 150px">

    # ${response.projectName}

    ## <h2 id="#description">Project Description</h2>
        ${response.description}

    ## Table of Contents

    * <a href="#license">License</a>
    * <a href="#description">Description</a>
    * <a href="#installation">Installation</a>
    * <a href="#technology">Technologies Used</a>
    * <a href="#contributors">Contributors</a>
    * <a href="#contact">Contact</a>

    ## <h2 id="installation">Installation</h2>
        ${response.installation}
    
    ## <h2 id="technology">Technologies Used</h2>
        ${response.technologies}

    ## <h2 id="contributors">Contributors</h2>
        [${response.contributors}](${response.contributors})

    ## <h2 id="contact">Contact</h2>

        * #### Name: ${resp.data.name}
        * #### GitHUB: ${resp.data.html_url}
        * #### Portfolio: [${response.livelink}](${response.livelink})
        * #### Email: ${resp.data.email}
        * #### LinkedIN: [${response.linkedin}](${response.linkedin})
    `
    fs.writeFile("Gen-README.md", readMeInfo, function(err){
        if (err) {
            return console.log(err);
        }
            console.log("Success!");
    });
}