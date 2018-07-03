export {database};

let database = (() => {
	function getUsers() {
		return JSON.parse(localStorage.getItem('onboardProjectUsers')) || [];
	}

	function saveUser(user) {
				let users = getUsers();
        let index = getIdIndex(user.id, users);

        const isNewUser = index === -1;

        if (isNewUser) {
          user.id = createNewUserId();
          users.splice(0, 0, user);
        } else {
          users.splice(index, 1, user);
        }

        updateLocalStorage(users);
      }

	function getIdIndex(id, users) {
        return (users) ? users.findIndex(val => val.id === id) : -1;
      }

	function updateLocalStorage(users){
		localStorage.setItem('onboardProjectUsers', JSON.stringify(users));
	}

	function createNewUserId() {
        let id = '';
        let asciiCharsLowest = 33;
        let asciiCharsHighest = 123;
        let idLength = 9;

        for (let i = 0; i < idLength; i++) {
          let charCode = Math.floor(Math.random() * (asciiCharsHighest - asciiCharsLowest)) + asciiCharsLowest;
          id += String.fromCharCode(charCode);
        }

        let doesIdExist = getIdIndex(id) === -1;
        return (doesIdExist) ? id : createNewUserId();
      }

		function deleteUser(user) {
				let users = getUsers();
        users.splice(getIdIndex(user.id, users), 1);
        updateLocalStorage(users);
      }

	return {
		getUsers: getUsers,
		deleteUser: deleteUser,
		saveUser: saveUser
	}
})();

