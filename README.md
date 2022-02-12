# startup-project
This repository contains the CSC 485A startup programming course project.  

[![Build and Deploy to Google Cloud Run ☁️⚙️🚀](https://github.com/devxp-ca/devxp/actions/workflows/deploy.yml/badge.svg?style=for-the-badge)](https://devxp.ca)  
![Languages](https://img.shields.io/github/languages/top/devxp-ca/devxp?style=plastic)  
![Size](https://img.shields.io/github/repo-size/devxp-ca/devxp?style=plastic)  
![Milestone 1](https://img.shields.io/github/milestones/progress/devxp-ca/devxp/1?style=plastic)  
![Milestone 2](https://img.shields.io/github/milestones/progress/devxp-ca/devxp/2?style=plastic)  
![Milestone 3](https://img.shields.io/github/milestones/progress/devxp-ca/devxp/3?style=plastic)  
![Issues](https://img.shields.io/github/issues/devxp-ca/devxp?style=plastic)  
![License](https://img.shields.io/github/license/devxp-ca/devxp?style=plastic)  
[![Deployment](https://img.shields.io/website?label=Deployment&style=plastic&url=https%3A%2F%2Fdevxp.ca)](https://devxp.ca)  
![contributors](https://img.shields.io/github/contributors/devxp-ca/devxp?style=plastic)  
![commits](https://img.shields.io/github/commit-activity/m/devxp-ca/devxp?style=plastic)  
![last commit](https://img.shields.io/github/last-commit/devxp-ca/devxp?style=plastic)  

**Application Deployment**: https://devxp.ca/


***TL;DR***  
*Two folders, `frontend/` and `backend/`, treat them as separate projects.*  
*Install nodeJS.*  
*In each run `npm install` to install JS libraries*  
*In each run `npm run dev` to launch a live updating development server.*
*In `backend/` create a `.env` file, and add the all the variables mentioned below, and from the slack channel*

## Developing

### Project Structure

In our project we have two subfolders, `frontend/` and `backend/`. You can treat these folders as separate "projects". Each one will have it's own `package.json` file for node, and will work independently of one and other up until deployment.  

### Packages and Libraries

In both, any time internal project dependancies change, ie we decide to use new packages or libraries, you need to run `npm install` (within the individual folders `frontend/` and `backend/`). This will tell node to check that all the JS libraries and packages are downloaded, and if they aren't will download them to the `node_modules/` folders. Node will completely manage this for you, but it is worth noting that whenever you `git pull` new changes, if those changes involved including a new library, you will need to re-run `npm install` (within the individual folders `frontend/` and `backend/`)  

### Development

In both folders `backend/` and `frontend/` a script is setup to launch a live updating development server for testing. This script can be run with `npm run dev` (From within one of the subfolders). In the `backend/` subproject, this command will launch a copy of the backend code (eventually a webserver) and will live refresh whenever changes are made to the backend code. In the `frontend/` subproject, this command will compile the react code into a webpage, and serve that webpage on a local server, made viewable in a local browser. It will live refresh whenever changes are made to the frontend code.  

### Env files

For the backend, we have a connection string environment variable with the user/pass for our DB connection. The point of using an environment variable instead of hardcoding it is so that the credential doesn't show up in the git repo, ie get leaked. It'll be set automatically in deployment, but for setting it locally easiest is to create a file `.env` (notice the dot) in the `backend/` folder, and add the line sent to the slack channel.
The `.env` is in the gitignore so it won't be tracked by the git repo, hence why we need to add it locally manually. Theres also a file called .env.sample with a template of how the .env file should look

Variables which must be set:
 - CONNECTION_STRING
 - GITHUB_CLIENT_ID
 - GITHUB_CLIENT_SECRET


## Dependencies

You'll need nodeJS installed on your computer. This is the runtime enviornment which allows us to run Javascript outside of the browser. It also comes with the npm package manager which we'll use for dependencies as well as development commands.  

For Windows:  
```
Go to https://nodejs.org/en/download/ and follow the steps
```

For MAC:  

In a terminal run  
```

#Install brew which is the MAC package manager for stuff like node
xcode-select --install
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

#Install node
brew update
brew install node
```

Linux:  

```
#Most likely something like:
sudo apt install nodejs
```
