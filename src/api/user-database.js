const databaseUrl = `http://iop-db.herokuapp.com/api`;
let popupMessage = null;
const sortSettings = {
  lastSort: 'lastName',
  // priority from right to left
  FIRST_NAME_SORT_ARRAY: ['lastName', 'firstName'],
  LAST_NAME_SORT_ARRAY: ['firstName', 'lastName'],
  DEPARTMENT_SORT_ARRAY: ['firstName', 'lastName', 'department'],
  isReversedSort: false
};

const sortCategories = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  DEPARTMENT: 'department'
};

export class Database {
  static getUsers() {
    this.getUsersSortedBy(sortSettings.lastSort);
  }

  static editUser(user) {
    popupMessage = `Edits to ${user.firstName} ${user.lastName} saved.`;
    this.sendRequest('PUT', user);
  }

  static saveUser(user) {
    popupMessage = `${user.firstName} ${user.lastName} added.`;
    this.sendRequest('POST', user);
  }

  static deleteUser(user) {
    popupMessage = `${user.firstName} ${user.lastName} deleted.`;
    this.sendRequest('DELETE', user);
  }

  static async getUserById(userId) {
    const requestUrl = `${databaseUrl}/${userId}`;
    const settings = {
      method: 'GET'
    };

    const response = await fetch(requestUrl, settings);
    const user = await response.json();

    this.sendUserById(user);
  }

  static async getUsersSortedBy(sortBy, isReverse) {
    sortSettings.lastSort = sortBy;
    sortSettings.isReversedSort = Boolean(isReverse);

    const settings = {
      headers: {
        Authorization: 'Basic ' + btoa('intern:polymer')
      }
    };
    const response = await fetch(databaseUrl, settings);

    if (response.status !== 200) {
      this.sendUserDatabaseError();
      return;
    }

    const users = await response.json();
    const sortFilterArray = this.getSortArray(sortBy);
    const sorted = this.sortUsers(sortFilterArray, users);

    this.sendUsers(sorted);
  }

  static getSortArray(sortFirstBy) {
    const firstName = sortCategories.FIRST_NAME;
    const lastName = sortCategories.LAST_NAME;
    const department = sortCategories.DEPARTMENT;

    if (sortFirstBy === lastName) {
      // sort priority goes right to left
      return sortSettings.LAST_NAME_SORT_ARRAY;
    }
    if (sortFirstBy === firstName) {
      return sortSettings.FIRST_NAME_SORT_ARRAY;
    }
    if (sortFirstBy === department) {
      return sortSettings.DEPARTMENT_SORT_ARRAY;
    }
  }

  static async sendRequest(method, user) {
    const requestUrl = user._id
      ? `${databaseUrl}/${user._id}`
      : `${databaseUrl}`;
    const formattedForDatabase = this.formatUserData(user);

    const settings = {
      method: method,
      body: formattedForDatabase,
      headers: {
        Authorization: 'Basic ' + btoa('intern:polymer'),
        'Content-Type': 'application/json'
      }
    };

    await fetch(requestUrl, settings);
    this.getUsersSortedBy(sortSettings.lastSort);
  }

  static sendUsers(users) {
    document.dispatchEvent(
      new CustomEvent('usersLoaded', {
        bubbles: true,
        composed: true,
        detail: {
          users: users,
          message: popupMessage
        }
      })
    );
    popupMessage = null;
  }

  static sendUserDatabaseError() {
    document.dispatchEvent(
      new CustomEvent('usersFailedToLoad', {
        bubbles: true,
        composed: true
      })
    );
  }

  // not currently connected to user-list
  static sendUserById(user) {
    document.dispatchEvent(
      new CustomEvent('userByIdLoaded', {
        bubbles: true,
        composed: true,
        detail: {
          user: user
        }
      })
    );
  }

  static sortUsers(sortFilterArray, users) {
    const sortFiltersArray = sortFilterArray || this.fallbackFilters();

    const sorted = users.sort((a, b) => {
      return this.compareTwoUsers(a, b, sortFiltersArray);
    });

    return sorted;
  }

  static fallbackFilters() {
    // priority from right to left
    return ['firstName', 'lastName'];
  }

  static compareTwoUsers(a, b, sortFilterArray) {
    let compared = 0;
    const primarySortFilter = sortFilterArray[sortFilterArray.length - 1];

    sortFilterArray.forEach(filter => {
      const categoryIsDifferent = a[filter] !== b[filter];
      const reverseSort =
        sortSettings.isReversedSort && filter === primarySortFilter;
      const aFirst = a[filter] > b[filter] ? 1 : -1;
      const bFirst = a[filter] < b[filter] ? 1 : -1;

      if (categoryIsDifferent) {
        compared = reverseSort ? bFirst : aFirst;
      }
    });

    return compared;
  }

  static formatUserData(user) {
    const formattedForDatabase = `{
      "firstName": "${this.titleCaseName(user.firstName)}",
      "lastName": "${this.titleCaseName(user.lastName)}",
      "phone": "${this.getOnlyPhoneDigits(user.phone)}",
      "email": "${user.email}",
      "department": "${user.department}"
    }`;

    return formattedForDatabase;
  }

  static getOnlyPhoneDigits(userPhoneInput) {
    return userPhoneInput.replace(/\D/g, '');
  }

  static titleCaseName(name) {
    const firstLetter = name.charAt(0).toUpperCase();
    const restOfName = name.slice(1).toLowerCase();

    return `${firstLetter}${restOfName}`;
  }
}
