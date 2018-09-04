# Banno Onboarding Project: Employee User Database Interface

## Description

This app allows you to create and edit user profiles. Each profile has an ID, Name, Number, Email Address, and Department.

Users are by default displayed as collapsed cards that can be expanded to show the user's information.

## To Start

1. Run `$ npm install` to add dependencies.
2. Run `$ yarn start` to fire up the server
3. Open `https://localhost:1820` in your browser.

## how to use

### Create User

- Clicking the add new user icon expands the create new user card.

- To cancel a new entry, the end user can click the cancel new user button at the top of the card.

- Appropriate warnings will notify the end user of improper email or phone formats.

  _Improper format will disable the save button._

### Edit/Delete User

- Clicking the edit button on an existing user card allows the end user to edit the fields for that user. Clicking save locks in the changes. Updated information will be displayed immediately on save.

- If you already have an edit in process, all edit and save buttons in other cards will be disabled.

- The save button in the current card will remain disabled while any fields are empty or formatted improperly.

### Changing User Component In Code

#### Modes

User component has three mode settings:

1. **Display:** If you pass a `user` object with an `id` property in to the `user-to-display` attribute, then the card will default to a collapsed display mode that only shows the first and last name and the expand for details button.

```html
 <user-component user-to-display="[[userToDisplay]]"></user-component>
```

```js
  static get properties() {
    return {

      // Format of the user object to be passed in
      userToDisplay: {
        type: Object,
        value: {
          first: "Jane",
          last: "Doe",
          id: "827104937",
          email: "something@gmail.com",
          phone: "(345) 435-9875"
        }
      }
    }
  }
```

2. **Edit:** Edit is availably in an existing user display card when you click edit.
3. **Create New:** If there is not a `user` object with an `id` property passed in, the card will init as a 'create new user' button that expands to display the new user form when you click it.

#### Disable Functionality: edit-open attribute

When an edit button is clicked in a `user-component`, that `user-component` dispatches an event received by `user-list`. The dispatched event lets other components know there is an edit currently in progress. The `user-component` uses this boolean to enable/disable save and edit buttons when an edit is open in another card.

`<user-component edit-open="[true,false]"><user-component>`

#### Persistent User Card Display: is-expanded attribute

Because of polymer's dom-repeat information recycling, class changes are re-used on the index of the dom-repeat slot.

For this app, if a user card is added or deleted, other user cards are at a different index in the dom-repeat and take on whatever class that item in that index had before the list update. This causes cards to display as collapsed or expanded when they should not.

Because of the dom-recycling feature of Polymer, the display state of each component is checked and its state is set using its id.

`<user-component is-expanded="[[isUserCardDisplayExpanded(user.id, users)]]"><user-component>`

```js
 isUserCardDisplayExpanded(userId) {
    let isExpanded = false;
      this.expandedCardIds.forEach(id => {
        if (id === userId) {
          isExpanded = true;
        }
      });

      return isExpanded;
    }
```

### NPM Scripts

#### To serve the app (also runs ux-lint):

        `$ yarn start` then open https://localhost:1820 in the browser.

        This lints, builds, and serves the project using webpack-dev-server

#### To see a list of available scripts [or a single script]:

        `$ yarn run help [filter scripts]`

#### To lint (UX-Lint)

        `$ yarn lint`

        `$ yarn start` also fires the linter in `pre-start` before serving the project.

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

You will not see the bundled folder locally when using `webpack-dev-server`.

If you want to bundle the files locally to see how they will be organized in webpack-dev-server, run `$ yarn build` which fires `webpack` and builds the file locally.

To view the bundled files from the server when using `webpack-dev-server`, enter `localhost:1820/webpack-dev-server` in your browser.

### Yarn

Used for running scripts instead of npm
