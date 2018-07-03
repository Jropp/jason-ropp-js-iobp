export { database };

let database = (() => {
  function getUsers() {
    return JSON.parse(localStorage.getItem("onboardProjectUsers")) || [];
  }

  function getUser(userId) {
    let users = getUsers();
    users.forEach(user => {
      if (user.id === userId) {
        return user;
      }
    });
  }

  function saveUser(user) {
    let users = getUsers();
    let index = getIdIndex(user.id);

    const isNewUser = index === -1;
    if (isNewUser) {
      user.id = createNewUserId();
      users.splice(0, 0, user);
    } else {
      users.splice(index, 1, user);
    }

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
    saveUser: saveUser,
    deleteUser: deleteUser,
    deleteUsers: deleteUsers
  };
})();
