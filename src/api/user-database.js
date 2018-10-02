let sortSettings = {
  lastSort: ['firstName', 'lastName'],
  isReversedSort: false
};

let popupMessage = null;

export class Database {
  static getUsers() {
    // priority from right to left
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

  static getUserById(userId) {
    let users = this.getUsers();

    let match = users.find(user => {
      return user.id === userId;
    });

    return match;
  }

  static getUsersSortedBy(sortFilterArray) {
    sortSettings.lastSort = sortFilterArray;
    let databaseUrl = `http://iop-db.herokuapp.com/users`;
    let xhr = new XMLHttpRequest();

    xhr.open('GET', databaseUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();

    xhr.onreadystatechange = responseText => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let users = JSON.parse(xhr.response);
        let sorted = this.sortUsers(sortFilterArray, users);
        this.sendUsers(sorted);
      }
    };
  }

  static sortUsers(sortFilterArray, users) {
    let sortFiltersArray = sortFilterArray || this.fallbackFilters();

    let sorted = users.sort((a, b) => {
      return this.compareTwoUsers(a, b, sortFiltersArray);
    });

    return sorted;
  }

  static setReversedSort(bool) {
    sortSettings.isReversedSort = bool;
  }

  static fallbackFilters() {
    // priority from right to left
    return ['firstName', 'lastName'];
  }

  static compareTwoUsers(a, b, sortFilterArray) {
    let compared = 0;
    let primarySortFilter = sortFilterArray[sortFilterArray.length - 1];

    sortFilterArray.forEach(filter => {
      let categoryIsDifferent = a[filter] !== b[filter];
      let reverseSort = sortSettings.isReversedSort && filter === primarySortFilter;
      let aFirst = a[filter] > b[filter] ? 1 : -1;
      let bFirst = a[filter] < b[filter] ? 1 : -1;

      if (categoryIsDifferent) {
        compared = reverseSort ? bFirst : aFirst;
      }
    });
    return compared;
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

  static sendRequest(method, user) {
    let databaseUrl = `http://iop-db.herokuapp.com/users`;
    let requestUrl = user._id ? `${databaseUrl}/${user._id}` : `${databaseUrl}`;
    let formattedForDatabase = this.formatUserData(user);
    let xhr = new XMLHttpRequest();

    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(formattedForDatabase);

    xhr.onreadystatechange = responseText => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.getUsersSortedBy(sortSettings.lastSort);
      }
    };
  }

  static formatUserData(user) {
    let formattedForDatabase = `{
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
    let firstLetter = name.charAt(0).toUpperCase();
    let restOfName = name.slice(1).toLowerCase();

    return `${firstLetter}${restOfName}`;
  }
}
