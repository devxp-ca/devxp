# startup-project
This repository contains the CSC 485A startup programming course project.  


***TL;DR***  
*Two folders, `frontend/` and `backend/`, treat them as separate projects.*  
*Install nodeJS.*  
*In each run `npm install` to install JS libraries*  
*In each run `npm run dev` to launch a live updating development server.*
*In `backend/` create a `.env` file, and add the CONNECTION_STRING variable from the slack channel*

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

