
import { Element as PolymerElement } from '@banno/polymer/polymer-element.js'; // eslint-disable-line no-unused-vars
import { Database } from './../api/user-database.js';

class UserListElement extends PolymerElement {
  static get is() { return 'user-list'; }
  static get properties() {
    return {
      users: {
        type: Array
      },
      editInProgress: {
        type: Boolean,
        value: false
      },
      expandedCardIds: {
        type: Array,
        value: []
      },
      sortCategories: {
        type: Object,
        value: () => {
          return {
            LAST_NAME: 'lastName',
            FIRST_NAME: 'firstName',
            DEPARTMENT: 'department'
          };
        },
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

    Database.setReversedSort(this.sortDirectionIsReversed);
    Database.getUsers();

    document.addEventListener('usersLoaded', (response) => {
      this.onUsersLoaded(response.detail);
    });

    document.addEventListener('cancel', () => {
      this.toggleMode();
    });

    document.addEventListener('editInProgress', e => {
      this.editInProgress = e.detail;
    });

    document.addEventListener('cardDetailDisplayChanged', (e) => {
      let cardIsExpanded = e.detail.expanded;
      return cardIsExpanded ? this.addIdToExpandedList(e.detail.id) : this.removeIdFromExpandedList(e.detail.id);
    });
  }

  onUsersLoaded(response) {
    this.users = response.users;
    let isEditSave = false;

    if (response.message) {
      this.popupMessage(response.message);
      const editInMessage = /edit/gi;
      isEditSave = editInMessage.test(response.message);
    }

    this.resetExpandedCardIds(isEditSave);
  }

  dropdownSort(e) {
    const primarySortBy = e.target.id;

    this.setSortedUsersBy(primarySortBy);
    this.resetExpandedCardIds(true);
  }

  setSortedUsersBy(sortFirstBy) {
    const sortBy = this.getSortArray(sortFirstBy);
    this.currentSortCategory = sortFirstBy;

    Database.getUsersSortedBy(sortBy);
  }

  getSortArray(sortFirstBy) {
    const firstName = this.sortCategories.FIRST_NAME;
    const lastName = this.sortCategories.LAST_NAME;
    const department = this.sortCategories.DEPARTMENT;

    if (sortFirstBy === lastName) {
      // sort priority goes right to left
      return [firstName, lastName];
    }
    if (sortFirstBy === firstName) {
      return [lastName, firstName];
    }
    if (sortFirstBy === department) {
      return [firstName, lastName, department];
    }
  }

  sortByDirection(e) {
    this.sortDirectionIsReversed = e.target.id === 'sortReversedAlphabetical';
    Database.setReversedSort(this.sortDirectionIsReversed);

    this.setSortedUsersBy(this.currentSortCategory);
    this.resetExpandedCardIds(true);
  }

  resetExpandedCardIds(reset) {
    if (reset) {
      this.expandedCardIds = [];
    } else {
      this.expandedCardIds = this.expandedCardIds;
    }
  }

  addIdToExpandedList(id) {
    this.expandedCardIds.splice(0, 0, id);
  }

  removeIdFromExpandedList(idToDelete) {
    const idIndex = this.expandedCardIds.findIndex(id => {
      return id === idToDelete;
    });

    this.expandedCardIds.splice(idIndex, 1);
  }

  noUsersHeaderMessage(users) {
    return !users.length;
  }

  popupMessage(action) {
    const animationTime = 3000;
    const messageBox = this.$.popupBox;

    messageBox.textContent = `${action} Successful`;
    messageBox.className = 'message-box show-message';

    window.setTimeout(() => {
      messageBox.className = 'message-box';
    }, animationTime);
  }

  isUserCardDisplayExpanded(userId) {
    let isExpanded = false;
    this.expandedCardIds.forEach(id => {
      if (id === userId) {
        isExpanded = true;
      }
    });

    return isExpanded;
  }

  setDisplayOfSortHeader(users, index) {
    const isFirstUser = index === 0;
    const deletedLastUser = index === users.length;

    if (isFirstUser || deletedLastUser) {
      return true;
    }

    const prevUserCat = users[index - 1][this.currentSortCategory];
    const curUserCat = users[index][this.currentSortCategory];

    const firstLetterDifferent = this.firstLetterOf(prevUserCat) !== this.firstLetterOf(curUserCat);
    const wholeWordDifferent = prevUserCat !== curUserCat;

    return this.categoryIsFirstOrLastName() ? firstLetterDifferent : wholeWordDifferent;
  }

  categoryIsFirstOrLastName() {
    const isFirstName = this.sortIs(this.sortCategories.FIRST_NAME, this.currentSortCategory);
    const isLastName = this.sortIs(this.sortCategories.LAST_NAME, this.currentSortCategory);

    return isFirstName || isLastName;
  }

  firstLetterOf(wordToSlice) {
    if (wordToSlice) {
      return wordToSlice.slice(0, 1);
    }
  }

  sortIs(expectedSortCategory, currentSortCategory) {
    return expectedSortCategory === currentSortCategory;
  }

  setNewGroupHeader(user) {
    const category = this.currentSortCategory || this.sortCategories.LAST_NAME;
    const firstLetter = `${this.firstLetterOf(user[category])}`;
    const wholeCategory = `${user[category]}`;

    return this.categoryIsFirstOrLastName() ? firstLetter : wholeCategory;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('usersLoaded');
    document.removeEventListener('cancel');
    document.removeEventListener('editInProgress');
    document.removeEventListener('cardDetailDisplayChanged');
  }
}

customElements.define(UserListElement.is, UserListElement);
export default UserListElement;
