# Banno Onboarding Project

## Description

This app allows you to create and edit user profiles, each of which have an ID, Name, Number, and Email Address.

To create a new user, click the 'Create User' button and fill out the form. Users will be added to the local storage database via the database API.

## how to use

### Warning

### Create User

Click on 'Create User' button, enter a user. Try leaving a field empty, it should tell you to fill out all of the fields. Cancelling should take you back to the users list. Saving will display the users list along with your new user.

### Edit/Delete User

You should be able to click the edit button and edit the fields for that user and save with the updated information displayed immediately.

If you leave a field empty and try to save, it should prompt you that a field is empty.

If you begin to edit a card and try to save a new user or save your edit before saving the open edit, it will prompt you to save the other open edit first.

If you click, delete, the user you selected to be deleted should disappear immediately, even if you have left an input field empty.

If there are no users, there should be an empty user card and a prompt to create a new user.

### Changing User Component In Code

User component has two mode settings:

`<user-component mode=['edit', 'display']><user-component>`

Changing that mode in the code will cause the state of the card to be that mode on load.

If no user is passed into the component it will serve as a 'create new user' card.

### NPM Scripts

    To serve the app (also runs ux-lint):

        `$ yarn start` then open https://localhost:1820 in the browser.

        This lints, builds, and serves the project using webpack-dev-server

    To see a list of available scripts [or a single script]:

        `$ yarn run help [filter scripts]`

    To lint (UX-Lint)

        `$ yarn lint`

        `$ yarn start` also fires the linter before serving the project.

    To bundle the code for production. It gets built into the dist folder in the root.

        `$ yarn build`

## dependencies

### Local Storage

The app database uses your browsers local storage. Clearing your browsers cache will delete that database of users.

### @Banno/Polymer

### Webpack

For building production code `$yarn build` bundles code into the dist folder.

### Webpack-Dev-Server

Webpack-dev-server wraps around webpack, bundling and serving the files for development purposes.

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
