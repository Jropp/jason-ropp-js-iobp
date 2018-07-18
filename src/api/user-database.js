export { database };

let database = (() => {
  function getUsers() {
    return JSON.parse(localStorage.getItem("onboardProjectUsers"));
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
    let formattedUser = formatUserData(user);
    let index = getIdIndex(user.id);
    users.splice(index, 1, formattedUser);

    updateLocalStorage(users);
  }

  function saveUser(user) {
    let users = getUsers() ? getUsers() : [];
    let formattedUser = formatUserData(user);
    users.splice(0, 0, formattedUser);
    updateLocalStorage(users);
  }

  function deleteUser(user) {
    let users = getUsers();
    users.splice(getIdIndex(user.id, users), 1);
    updateLocalStorage(users);
  }

  function deleteUsers() {
    localStorage.setItem("onboardProjectUsers", JSON.stringify([]));
  }

  function getIdIndex(id) {
    let users = getUsers();
    return users ? users.findIndex(val => val.id === id) : -1;
  }

  function formatUserData(user) {
    if (!user.id) {
      user.id = createNewUserId();
    }
    user.phone = getDigitsFromNumber(user.phone);
    return user;
  }

  function getDigitsFromNumber(userPhoneInput) {
    return userPhoneInput.replace(/\D/g, "");
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
