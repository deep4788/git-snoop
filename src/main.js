#!/usr/bin/env node
"use strict";

const fs = require("fs");

const chalk = require("chalk");
const shell = require("shelljs");

//Max number of commiters to show; for now 10 (NOTE: this can be changed)
let maxCommitersToShow = 10;

//Shell commands
let repoNameCmd = "basename `git rev-parse --show-toplevel`";
let firstCommitCmd = "git log --reverse --format='format:%ci' | head -1 | awk '{ print $1 }'";
let authorsCommitsCmd = "git shortlog -s -n --all | awk '{ print $0\"|;:\"}'";

//Holds the git data for this repo
let gitRepoData = {
  repoName: "",
  firstCommit: "",
  mainAuthorName: "",
  currentStatus: {
    recentBranch: "",
    untrackedfiles: "",
    changedFiles: ""
  },
  authorsContributions: [],
  languagesStatistics: [],
  branches: [],
  fileTypes: [],
  commitLogs: []
};

/**
 * @brief Executes shell command
 *
 * @param commandToExec The command to execute
 *
 * @return Returns the stdout output of the shell command
 */
function execShellCommand(commandToExec) {
  return shell.exec(commandToExec, {silent: true}).stdout.replace(/^\s+|\s+$/g, '') || "N/A";
}

/**
 * @brief Displayes git statistics
 */
function displayGitStats() {
  //TODO: pretty print this
  console.log("Repo: ", gitRepoData.repoName);
  console.log("First-commit: ", gitRepoData.firstCommit);

  let noOfCommiters = gitRepoData.authorsContributions.length;
  let noOfCommitersToShow = noOfCommiters > maxCommitersToShow ? maxCommitersToShow : noOfCommiters;
  for(let i = 0; i < noOfCommitersToShow; i++) {
    console.log(`#Commits: ${gitRepoData.authorsContributions[i].noOfCommits}, ${gitRepoData.authorsContributions[i].name}`);
  }



}

/**
 * @brief Get all the Git data and process it to
 *  generate displayable info
 */
function getAndProcessGitData() {
  //Name of the Repository
  gitRepoData.repoName = execShellCommand(repoNameCmd);

  //First commit date
  gitRepoData.firstCommit = execShellCommand(firstCommitCmd);

  //Get Authors Contributions
  let authorsCommits = execShellCommand(authorsCommitsCmd).split("|;:");
  //authorsContributions: [],
  for(let i = 0; i < authorsCommits.length - 1; i++) {
    let [ noOfCommits, name ] = authorsCommits[i].replace(/^\s+|\s+$/g, '').split("\t");
    gitRepoData.authorsContributions.push({ "noOfCommits": noOfCommits, "name": name });
  }

  //Get Main Author (Most commits)

  //Get Current Status

  //Get Languages Statistics

  //Get Branches

  //Get Filetypes

  //Get Commit Logs

  //Display the statistics
  displayGitStats();
}

/**
 * @brief Checks for availability of dependencies and
 *   calls @getAndProcessGitData
 */
function main() {
  //Check if this is a git repository or not
  if(!fs.existsSync(".git")) {
    console.log(chalk.red.bold("ERROR: no .git directory present"));
    process.exit(1);
  }

  //Check that git is installed
  if(!shell.which("git")) {
    console.log(chalk.red.bold("ERROR: this script requires git"));
    process.exit(1);
  }

  //Start gathering data for presentation
  getAndProcessGitData();
}

if(require.main === module) {
  main();
}
