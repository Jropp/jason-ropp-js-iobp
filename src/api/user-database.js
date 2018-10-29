const databaseUrl = `http://iop-db.herokuapp.com/api`;
let popupMessage = null;
const sortSettings = {
  // priority from right to left
  lastSort: ['firstName', 'lastName'],
  isReversedSort: false
};
export class Database {
  static getUsers() {
    this.getUsersSortedBy(sortSettings.lastSort);
  }

  static editUser(user) {
    popupMessage = 'Edit Save';
    this.sendRequest('PUT', user);
  }

  static saveUser(user) {
    popupMessage = 'Save New User';
    this.sendRequest('POST', user);
  }

  static deleteUser(user) {
    popupMessage = 'Delete User';
    this.sendRequest('DELETE', user);
  }

  static async getUserById(userId) {
    const requestUrl = `${databaseUrl}/${userId}`;
    const settings = {
      method: 'GET'
    }

    const response = await fetch(requestUrl, settings);
    const user = await response.json();

    this.sendUserById(user);
  }

  static async getUsersSortedBy(sortFilterArray) {
    sortSettings.lastSort = sortFilterArray;

    const response = await fetch(databaseUrl);
    const users = await response.json();
    const sorted = this.sortUsers(sortFilterArray, users);

   this.sendUsers(sorted);
  }

  static async sendRequest(method, user) {
    const requestUrl = user._id ? `${databaseUrl}/${user._id}` : `${databaseUrl}`;
    const formattedForDatabase = this.formatUserData(user);

    const settings = {
      method: method,
      body: formattedForDatabase,
      headers: {
        'Content-Type': 'application/json'
      }
    }

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
      const reverseSort = sortSettings.isReversedSort && filter === primarySortFilter;
      const aFirst = a[filter] > b[filter] ? 1 : -1;
      const bFirst = a[filter] < b[filter] ? 1 : -1;

      if (categoryIsDifferent) {
        compared = reverseSort ? bFirst : aFirst;
      }
    });
    return compared;
  }

  static setReversedSort(bool) {
    sortSettings.isReversedSort = bool;
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
