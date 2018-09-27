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
        let sortFilters = filters ? filters : this.fallbackFilters();
        let sorted = JSON.parse(xhr.response).sort((a, b) => {
          return this.compareTwoUsers(a, b, sortFilters);
        });

        this.sendUsers(sorted);
        firstLoad = false;
      }
    };
  }

  static fallbackFilters() {
    // priority from right to left
    return ["department", "firstName", "lastName"];
  }

  static sendRequest(method, user, _id) {}

  static editUser(user) {
    let databaseUrl = `http://iop-db.herokuapp.com/users/${user._id}`;
    let formatted = this.formatUserData(user);

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", databaseUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(formatted);
    xhr.onreadystatechange = responseText => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
        this.getUsersSortedBy(lastSort);
      }
    };
  }

  static saveUser(user) {
    let databaseUrl = `http://iop-db.herokuapp.com/users`;
    let formatted = this.formatUserData(user);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", databaseUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(formatted);
    xhr.onreadystatechange = responseText => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("hey", xhr.responseText);
        this.getUsersSortedBy(lastSort);
      }
    };
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
