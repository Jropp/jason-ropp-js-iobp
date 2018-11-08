import { Element as PolymerElement } from '@banno/polymer/polymer-element.js'; // eslint-disable-line no-unused-vars
import { Database } from './../api/user-database.js';

class UserListElement extends PolymerElement {
  static get is() {
    return 'user-list';
  }
  static get properties() {
    return {
      users: {
        type: Array
      },
      noServerResponse: {
        type: Boolean,
        value: false
      },
      toastMessage: {
        type: String
      },
      editInProgress: {
        type: Boolean,
        value: false
      },
      expandedCardIds: {
        type: Array,
        value: []
      },
      sortCategoryOptions: {
        type: Array,
        value: () => ['Last Name', 'First Name', 'Department']
      },
      sortDirectionOptions: {
        type: Array,
        value: () => ['A-Z', 'Z-A']
      },
      sortCategories: {
        type: Object,
        value: () => {
          return {
            LAST_NAME: 'lastName',
            FIRST_NAME: 'firstName',
            DEPARTMENT: 'department'
          };
        }
      },
      currentSortCategory: {
        type: String,
        value: 'lastName'
      },
      sortDirectionIsReversed: {
        type: Boolean,
        value: false
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListeners();

    Database.getUsersSortedBy(
      this.currentSortCategory,
      this.sortDirectionIsReversed
    );
  }

  addEventListeners() {
    document.addEventListener('usersLoaded', response => {
      this.noServerResponse = false;
      this.onUsersLoaded(response.detail);
    });

    document.addEventListener('usersFailedToLoad', response => {
      this.noServerResponse = true;
    });

    document.addEventListener('editButtonClicked', e => {
      this.editInProgress = e.detail.editInProgress;
    });

    document.addEventListener('cardDetailDisplayChanged', e => {
      let cardIsExpanded = e.detail.expanded;
      return cardIsExpanded
        ? this.addIdToExpandedList(e.detail.id)
        : this.removeIdFromExpandedList(e.detail.id);
    });
  }

  onUsersLoaded(response) {
    this.users = response.users;

    if (response.message) {
      this.sendToast(response.message);
    }
  }

  sendToast(message) {
    const toastReset = '';
    this.toastMessage = toastReset;
    this.toastMessage = message;
  }

  formatSortSelectionForDatabase(selected) {
    if (selected === 'Last Name') {
      return this.sortCategories.LAST_NAME;
    }
    if (selected === 'First Name') {
      return this.sortCategories.FIRST_NAME;
    }
    if (selected === 'Department') {
      return this.sortCategories.DEPARTMENT;
    }
  }

  dropdownSort(e) {
    this.currentSortCategory = this.formatSortSelectionForDatabase(
      e.target.selectedItem
    );

    Database.getUsersSortedBy(
      this.currentSortCategory,
      this.sortDirectionIsReversed
    );

    this.resetExpandedCardIds();
  }

  sortByDirection(e) {
    this.sortDirectionIsReversed = e.target.selectedItem === 'Z-A';

    Database.getUsersSortedBy(
      this.currentSortCategory,
      this.sortDirectionIsReversed
    );

    this.resetExpandedCardIds();
  }

  resetExpandedCardIds() {
    this.expandedCardIds = [];
  }

  addIdToExpandedList(id) {
    this.expandedCardIds.splice(0, 0, id);
  }

  removeIdFromExpandedList(idToDelete) {
    const idIndex = this.expandedCardIds.indexOf(idToDelete);

    this.expandedCardIds.splice(idIndex, 1);
  }

  noUsersInDatabase(users) {
    return !users.length;
  }

  isUserCardDisplayExpanded(userId) {
    return this.expandedCardIds.includes(userId);
  }

  setDisplayOfSortHeader(users, user, index, category) {
    let isFirstUser = index === 0
    let deletedLastUser = index === users.length;

    if (isFirstUser || deletedLastUser) {
      return true;
    }

    let currentUser = user[category];
    let previousUser = users[index - 1][category];

    if (this.dipslayFirstLetterOnly()) {
      return currentUser[0] !== previousUser[0];
    }

    const displayWholeCategory = currentUser !== previousUser;

    return displayWholeCategory;
  }

  dipslayFirstLetterOnly() {
    return (
      this.sortIs(this.sortCategories.FIRST_NAME, this.currentSortCategory) ||
      this.sortIs(this.sortCategories.LAST_NAME, this.currentSortCategory)
    );
  }

  sortIs(expectedSortCategory, currentSortCategory) {
    return expectedSortCategory === currentSortCategory;
  }

  setNewGroupHeaderText(user, category) {
    const firstLetter = `${user[category][0]}`;
    const wholeCategory = `${user[category]}`;

    return this.dipslayFirstLetterOnly() ? firstLetter : wholeCategory;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('usersLoaded');
    document.removeEventListener('editInProgress');
    document.removeEventListener('cardDetailDisplayChanged');
  }
}

customElements.define(UserListElement.is, UserListElement);
export default UserListElement;
