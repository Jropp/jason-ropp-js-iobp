let lastSort = ["department", "firstName", "lastName"];

export class Database {
  static getUsers() {
    // priority from right to left
    this.getUsersSortedBy(["department", "firstName", "lastName"]);
  }

  static sendUsers(users) {
    document.dispatchEvent(
      new CustomEvent("usersLoaded", {
        bubbles: true,
        composed: true,
        detail: users
      })
    );
  }

  static getUserById(userId) {
    let users = this.getUsers();

    let match = users.find(user => {
      return user.id === userId;
    });

    return match;
  }

  static getUsersSortedBy(filters) {
    lastSort = filters;
    let databaseUrl = `http://iop-db.herokuapp.com/users`;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", databaseUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.onreadystatechange = responseText => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let sorted = this.sortUsers(filters, JSON.parse(xhr.response));
        this.sendUsers(sorted);
      }
    };
  }

  static sortUsers(filters, users) {
    let sortFilters = filters ? filters : this.fallbackFilters();
    let sorted = users.sort((a, b) => {
      return this.compareTwoUsers(a, b, sortFilters);
    });
    return sorted;
  }

  static fallbackFilters() {
    // priority from right to left
    return ["department", "firstName", "lastName"];
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

  static editUser(user) {
    this.sendRequest("PUT", user);
  }

  static saveUser(user) {
    this.sendRequest("POST", user);
  }

  static sendRequest(method, user) {
    let databaseUrl = `http://iop-db.herokuapp.com/users`;
    let requestUrl = user._id ? `${databaseUrl}/${user._id}` : `${databaseUrl}`;
    let formatted = this.formatUserData(user);

    let xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(formatted);
    xhr.onreadystatechange = responseText => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.getUsersSortedBy(lastSort);
      }
    };
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
    let formatted = `{
      "firstName": "${this.titleCaseName(user.firstName)}",
      "lastName": "${this.titleCaseName(user.lastName)}",
      "phone": "${this.getOnlyPhoneDigits(user.phone)}",
      "email": "${user.email}",
      "department": "${user.department}"
    }`;

    return formatted;
  }

  static getOnlyPhoneDigits(userPhoneInput) {
    return userPhoneInput.replace(/\D/g, "");
  }

  static titleCaseName(name) {
    let firstLetter = name.charAt(0).toUpperCase();
    let restOfName = name.slice(1).toLowerCase();

    return `${firstLetter}${restOfName}`;
  }
}
