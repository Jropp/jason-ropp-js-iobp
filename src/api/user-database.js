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
    return "User Not Found";
  }

  function editUser(user) {
    let users = getUsers();
    let index = getIdIndex(user.id);
    users.splice(index, 1, user);

    updateLocalStorage(users);
  }

  function saveUser(user) {
    let users = getUsers();
    user.id = createNewUserId();
    users.splice(0, 0, user);
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
