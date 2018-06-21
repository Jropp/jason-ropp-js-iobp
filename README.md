# Banno Onboarding Project

## Description

This app allows you to create and edit user profiles, each of which have an ID, Name, Number, and Email Address.

To create a new user, click the 'Create User' tab and fill out the form. Users will be added to the local storage database. 

## how to use

### Warning

Not currently compatible with firefox, will be addressed in update of webpackconfig

### Create User

Click on 'Create User' tab, enter a user. Try leaving a field empty, it should tell you to fill out all of the fields.

### Users List: Edit/Delete User

Your created user should appear after clicking the User List tab. You should be able to click the edit button and edit the fields for that user and save with the updated information displayed immediately. 

If you leave a field empty, it should prompt you that a field is empty.

If you click, delete, the user you selected to be deleted should be gone.

If there are no users, there should be an empty user card.

### User Profile

Because there currently is not a way to select a particular user, you should just see a 'no user currently selected' message.

### Changing User Component In Code

User component has two mode settings:

`<user-component mode=['edit', 'display']><user-component>` 

Changing that mode in the code will cause the state of the card to be that mode on load.

If no user is passed into the component it will serve as a 'create new user' card. 

### NPM Scripts
    To serve the app (also runs ux-lint):

        `$ yarn start` then open https://localhost:1820 in the browser.

        This lints, builds, and serves the project

    To see a list of available scripts [or a single script]: 
    
        `$ yarn run help [filter scripts]`

    To lint (UX-Lint)

        `$ yarn lint`

    To build a local example of the bundled file structure that webpack-dev-server uses

        `$ yarn build`


## dependencies

### Local Storage

  The app database uses your browsers local storage. Clearing your browsers cache will delete that database of users.

### @Banno/Polymer

### Webpack-Dev-Server

  Webpack-dev-server wraps around webpack, bundling and serving the files. 

  The bundling and serving happens together on `$ yarn start`

  #### To Build File Structure Locally

  You will not see the bundled folder locally when using webpack-dev-server. 

  If you want to bundle the files locally to see how they will be organized in webpack-dev-server, run `$ yarn build` which fires `webpack` and builds the file locally. 
  
  To view the bundled files from the server:

  `localhost:1820/localhost:8080/webpack-dev-server` in your browser.
  

  ##### Notes


### UX-Lint

  Banno's lint packages for linting files. The .editorconfig file is set up to match Banno's styleguide

### Yarn 
  
  Used for running scripts instead of npm
