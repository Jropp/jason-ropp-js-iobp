# Banno Onboarding Project

## Description

This app allows you to create and edit user profiles, each of which have an ID, Name, Number, and Email Address.

To create a new user, click the 'Create User' button and fill out the form. Users will be added to the local storage database via the database API.

## how to use

### Create User

- Clicking the add new user icon expands the create new user card.

- Cancelling or saving a user collapses the add new user card.

- Appropriate warnings will notify the end-user of improper format of email or phone.

- Improper format will also disable the save button.

### Edit/Delete User

- Clicking the edit button allows you to edit the fields for that user. Updated information will be displayed immediately on save.

- If you already have an edit in process, all other edit and save buttons in other cards will be disabled.

- Editing an existing user disables the option to save other existing users or a new user.

- Deleted users disappear immediately.

- The save button remains disabled while any fields are empty or formatted improperly.

- If there are no users, there should be a message prompt to create a new user.

### Changing User Component In Code

#### Modes

User component has two mode settings:

`<user-component mode=['edit', 'display']><user-component>`

Changing that mode in the code will cause the state of the card to be that mode on load. If no user is passed into the component it will serve as a 'create new user' card.

#### Disable Functionality

When an edit button is clicked in a user-component, that user-component dispatches an event received by user-list to let other components know that there is an open edit. The user component uses this boolean to enable/disable save and edit buttons when another edit is open.

`<user-component edit-open="[true,false]"><user-component>`

### NPM Scripts

#### To serve the app (also runs ux-lint):

        `$ yarn start` then open https://localhost:1820 in the browser.

        This lints, builds, and serves the project using webpack-dev-server

#### To see a list of available scripts [or a single script]:

        `$ yarn run help [filter scripts]`

#### To lint (UX-Lint)

        `$ yarn lint`

        `$ yarn start` also fires the linter before serving the project.

#### To bundle the code for production. It gets built into the dist folder in the root.

        `$ yarn build`

## dependencies

### Local Storage / API

The app database API uses your browsers local storage. Clearing your browsers cache will delete that database of users.

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

### Color Scheme

Primary App Color: #0070b7
Secondary App Color: #fca902
Tertiary App Color: #e4e7ea

### UX-Lint

Banno's lint packages for linting files. The .editorconfig file is set up to match Banno's styleguide

### Yarn

Used for running scripts instead of npm
