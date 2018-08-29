export { database };

let database = (() => {
  function getUsers() {
    return JSON.parse(localStorage.getItem("onboardProjectUsers")) || [];
  }

  function getUserById(userId) {
    let users = getUsers();

    let match = users.find(user => {
      return user.id === userId;
    });

    return match;
  }

  function editUser(user) {
    let users = getUsers();
    users.splice(getIdIndex(user.id), 1, formatUserData(user));
    updateLocalStorage(users, "Edit");
  }

  function saveUser(user) {
    let users = getUsers() ? getUsers() : [];
    users.splice(0, 0, formatUserData(user));
    updateLocalStorage(users, "Save");
  }

  function deleteUser(user) {
    let users = getUsers();
    users.splice(getIdIndex(user.id, users), 1);
    updateLocalStorage(users, "Delete");
  }

  function deleteUsers() {
    localStorage.setItem("onboardProjectUsers", JSON.stringify([]));
  }

  function getIdIndex(id) {
    let users = getUsers();
    return users ? users.findIndex(val => val.id === id) : -1;
  }

  function formatUserData(user) {
    user.first = titleCaseName(user.first);
    user.last = titleCaseName(user.last);
    user.id = user.id || createNewUserId();
    user.phone = getDigitsFromNumber(user.phone);
    return user;
  }

  function getDigitsFromNumber(userPhoneInput) {
    return userPhoneInput.replace(/\D/g, "");
  }

  function titleCaseName(name) {
    let loweredCase = name.slice(1).toLowerCase();
    return name.charAt(0).toUpperCase() + loweredCase;
  }

  function updateLocalStorage(users, action) {
    localStorage.setItem("onboardProjectUsers", JSON.stringify(users));
    document.dispatchEvent(
      new CustomEvent("databaseUpdated", {
        bubbles: true,
        composed: true,
        detail: { message: action }
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

    let idAlreadyExists = getIdIndex(id) !== -1;
    return idAlreadyExists ? createNewUserId() : id;
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
