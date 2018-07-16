# Banno Onboarding Project

## Description

This app allows you to create and edit user profiles, each of which have an ID, Name, Number, and Email Address.

To create a new user, click the 'Create User' button and fill out the form. Users will be added to the local storage database via the database API.

## how to use

### Warning

Don't spit into the wind

### Create User

Click on 'Create New User' button, enter a user. If you leave a field empty, the save button will remain disabled.

Cancelling should collapsed the create user card into the 'Create New User' button. Saving will display your new user in the users list.

### Edit/Delete User

You should be able to click the edit button and edit the fields for that user and save with the updated information displayed immediately.

If you already have an edit in process, all other edit and save buttons in other cards will be disabled.

If you begin to edit a card and try to save a new user or save your edit before saving the open edit, it will prompt you to save the other open edit first.

If you click, delete, the user you selected to be deleted should disappear immediately, even if you have left an input field empty.

If you leave a field empty the save button will remain disabled.

If you click delete, the user you selected to be deleted should disappear immediately, even if you have left an input field empty.

If there are no users, there should be a message prompt to create a new user.

### Changing User Component In Code

#### Modes

User component has two mode settings:

`<user-component mode=['edit', 'display']><user-component>`

Changing that mode in the code will cause the state of the card to be that mode on load.

If no user is passed into the component it will serve as a 'create new user' card.

#### Disable Functionality

When an edit button is clicked in a user-component, that user-component dispatches an event to disable (or enable on save) the edit buttons of other cards if the parent (in this case user-list) chooses to pass disabling down into the user-component.

`<user-component disableEdit=['true', 'false'] disableSave=['true', 'false']><user-component>`

While disableEdit and disableSave have distinct uses in their respective 'New User' and 'Edit User' user-components, it is adviseable to send information into both the disableEdit and disableSave if both types of user-component are being used on the same page.

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

`localhost:1820/localhost:1820/webpack-dev-server` in your browser.

##### Notes

### UX-Lint

Banno's lint packages for linting files. The .editorconfig file is set up to match Banno's styleguide

### Yarn

Used for running scripts instead of npm
