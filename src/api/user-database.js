export class Database {
  static getUsers() {
    return JSON.parse(localStorage.getItem("onboardProjectUsers")) || [];
  }

  static getUserById(userId) {
    let users = this.getUsers();

    let match = users.find(user => {
      return user.id === userId;
    });

    return match;
  }

  static getUsersSortedBy(filters) {
    let users = JSON.parse(localStorage.getItem("onboardProjectUsers")) || [];
    let sortFilters = filters.length ? filters : this.fallbackFilters();
    sortFilters.reverse();

    let sorted = users.sort((a, b) => {
      return this.compareTwoUsers(a, b, sortFilters);
    });

    return sorted;
  }

  static fallbackFilters() {
    return ["last", "first", "department"];
  }

  static editUser(user) {
    let users = this.getUsers();
    let popupMessage = "Save";

    users.splice(this.getIdIndex(user.id), 1, this.formatUserData(user));

    this.updateLocalStorage(users, popupMessage);
  }

  static saveUser(user) {
    let users = this.getUsers();
    let popupMessage = "Save";

    users.splice(0, 0, this.formatUserData(user));

    this.updateLocalStorage(users, popupMessage);
  }

  static compareTwoUsers(a, b, filters) {
    let compared = 0;

    filters.forEach(filter => {
      if (a[filter] !== b[filter]) {
        compared = a[filter] > b[filter] ? 1 : -1;
        return;
      }
    });

    return compared;
  }

  static deleteUser(user) {
    let users = this.getUsers();
    let popupMessage = "Delete";

    users.splice(this.getIdIndex(user.id, users), 1);

    this.updateLocalStorage(users, popupMessage);
  }

  static deleteAllUsers() {
    let popupMessage = "Delete All Users";
    this.updateLocalStorage([], popupMessage);
  }

  static getIdIndex(userId) {
    let users = this.getUsers();
    let userIndex = users ? users.findIndex(user => user.id === userId) : -1;

    return userIndex;
  }

  static formatUserData(user) {
    user.first = this.titleCaseName(user.first);
    user.last = this.titleCaseName(user.last);
    user.id = user.id || this.createNewUserId();
    user.phone = this.getOnlyPhoneDigits(user.phone);

    return user;
  }

  static getOnlyPhoneDigits(userPhoneInput) {
    return userPhoneInput.replace(/\D/g, "");
  }

  static titleCaseName(name) {
    let firstLetter = name.charAt(0).toUpperCase();
    let restOfName = name.slice(1).toLowerCase();

    return `${firstLetter}${restOfName}`;
  }

  static updateLocalStorage(users, popupMessage) {
    localStorage.setItem("onboardProjectUsers", JSON.stringify(users));

    document.dispatchEvent(
      new CustomEvent("databaseUpdated", {
        bubbles: true,
        composed: true,
        detail: { message: popupMessage }
      })
    );
  }

  static createNewUserId() {
    const asciiCharsLowest = 33;
    const asciiCharsHighest = 123;
    const idLength = 9;
    let id = "";

    for (let i = 0; i < idLength; i++) {
      let charCode =
        Math.floor(Math.random() * (asciiCharsHighest - asciiCharsLowest)) +
        asciiCharsLowest;
      id += String.fromCharCode(charCode);
    }

    let idAlreadyExists = this.getIdIndex(id) !== -1;

    return idAlreadyExists ? this.createNewUserId() : id;
  }
}
