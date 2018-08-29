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
    let popupMessage = "Save";

    users.splice(getIdIndex(user.id), 1, formatUserData(user));

    updateLocalStorage(users, popupMessage);
  }

  function saveUser(user) {
    let users = getUsers() ? getUsers() : [];
    let popupMessage = "Save";

    users.splice(0, 0, formatUserData(user));

    updateLocalStorage(users, popupMessage);
  }

  function deleteUser(user) {
    let users = getUsers();
    let popupMessage = "Delete";

    users.splice(getIdIndex(user.id, users), 1);

    updateLocalStorage(users, popupMessage);
  }

  function deleteAllUsers() {
    localStorage.setItem("onboardProjectUsers", JSON.stringify([]));
  }

  function getIdIndex(userId) {
    let users = getUsers();
    let userIndex = users ? users.findIndex(user => user.id === userId) : -1;
    return userIndex;
  }

  function formatUserData(user) {
    user.first = titleCaseName(user.first);
    user.last = titleCaseName(user.last);
    user.id = user.id || createNewUserId();
    user.phone = getOnlyPhoneDigits(user.phone);
    return user;
  }

  function getOnlyPhoneDigits(userPhoneInput) {
    return userPhoneInput.replace(/\D/g, "");
  }

  function titleCaseName(name) {
    let firstLetter = name.charAt(0).toUpperCase();
    let restOfName = name.slice(1).toLowerCase();
    return `${firstLetter}${restOfName}`;
  }

  function updateLocalStorage(users, popupMessage) {
    localStorage.setItem("onboardProjectUsers", JSON.stringify(users));

    document.dispatchEvent(
      new CustomEvent("databaseUpdated", {
        bubbles: true,
        composed: true,
        detail: { message: popupMessage }
      })
    );
  }

  function createNewUserId() {
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

    let idAlreadyExists = getIdIndex(id) !== -1;
    return idAlreadyExists ? createNewUserId() : id;
  }

  return {
    getUsers: getUsers,
    getUserById: getUserById,
    saveUser: saveUser,
    editUser: editUser,
    deleteUser: deleteUser,
    deleteAllUsers: deleteAllUsers
  };
})();
