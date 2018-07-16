export { database };

let database = (() => {
  function getUsers() {
    return JSON.parse(localStorage.getItem("onboardProjectUsers")) || [];
  }

  function getUserById(userId) {
    let users = getUsers();
    users.forEach(user => {
      if (user.id === userId) {
        return user;
      }
    });
    return {};
  }

  function editUser(user) {
    let users = getUsers();
    let index = getIdIndex(user.id);
    users.splice(index, 1, user);

    updateLocalStorage(users);
  }

  function saveUser(user) {
    let users = getUsers();
    let normalizedUser = normalizeUserData(user);
    users.splice(0, 0, normalizedUser);
    updateLocalStorage(users);
  }

  function deleteUser(user) {
    let users = getUsers();
    let normalizedUser = normalizeUserData(user);
    users.splice(getIdIndex(user.id, users), 1);
    updateLocalStorage(normalizedUser);
  }

  function deleteUsers() {
    localStorage.setItem("onboardProjectUsers", JSON.stringify([]));
  }

  function getIdIndex(id) {
    let users = getUsers();
    return users ? users.findIndex(val => val.id === id) : -1;
  }

  function normalizeUserData(user) {
    if (!user.id) {
      user.id = user.id = createNewUserId();
    }
    user.phone = normalizePhoneNumber(user);
    return user;
  }

  function normalizePhoneNumber(user) {
    let numbers = extractPhoneNumbers(user.phone);
    let formattedNumber = insertPhoneSymbols(numbers);
    return formattedNumber;
  }

  function extractPhoneNumbers(userPhoneInput) {
    let numbers = [];
    let isDigit = /\d/;

    for (let char of userPhoneInput) {
      if (isDigit.test(char)) {
        numbers.push(char);
      }
    }

    return numbers;
  }

  function insertPhoneSymbols(phoneArray) {
    phoneArray = phoneArray.reverse();
    let domesticSymbols = [
      { name: "dash", loc: 4, text: "-" },
      { name: "spaceLoc", loc: 8, text: " " },
      { name: "leftParLoc", loc: 9, text: ")" },
      { name: "rightParLoc", loc: 13, text: "(" }
    ];

    domesticSymbols.forEach(symbol => {
      phoneArray.splice(symbol.loc, 0, symbol.text);
    });

    let domesticNumLength = 14;
    let interSpaceLoc = 14;
    if (phoneArray.length > domesticNumLength) {
      phoneArray.splice(interSpaceLoc, 0, " ");
      let internationalNumPre = "+";
      phoneArray.push(internationalNumPre);
    }

    phoneArray = phoneArray.reverse();
    return phoneArray.join("");
  }

  function updateLocalStorage(users) {
    localStorage.setItem("onboardProjectUsers", JSON.stringify(users));
    document.dispatchEvent(
      new CustomEvent("databaseUpdated", {
        bubbles: true,
        composed: true
      })
    );
  }

  function createNewUserId() {
    let id = "";
    let asciiCharsLowest = 33;
    let asciiCharsHighest = 123;
    let idLength = 9;

    for (let i = 0; i < idLength; i++) {
      let charCode =
        Math.floor(Math.random() * (asciiCharsHighest - asciiCharsLowest)) +
        asciiCharsLowest;
      id += String.fromCharCode(charCode);
    }

    let doesIdExist = getIdIndex(id) !== -1;
    return doesIdExist ? createNewUserId() : id;
  }

  return {
    getUsers: getUsers,
    getUserById: getUserById,
    saveUser: saveUser,
    editUser: editUser,
    deleteUser: deleteUser,
    deleteUsers: deleteUsers
  };
})();
