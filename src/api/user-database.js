// let database = (() => {
//   function getUsers() {
//     return JSON.parse(localStorage.getItem('roppProjectUserDatabase'));
//   }

//   function deleteUsers() {
//     savetoDatabase([]);
//   }

//   function editUser(user, index) {
//     let users = getUsers();
//     users.splice(index, 1, user);
//     saveToDatabase(users);
//   }

//   function saveUser(user) {
//     user.id = createNewUserId();
//     let index = getIndex();
//     if (index !== -1) {
//       editUser(user, index);
//       return;
//     }

//     let users = getUsers();
//     users.splice(0, 0, user);
//     saveToDatabase(users);
//   }

//   function deleteUser(userId) {
//     let users = getUsers();
//     users.splice(getIndex(users, userId), 1);
//     saveToDatabase(users);
//   }

//   function getIndex(users, userId) {
//     return users.findIndex(val => val.id === userId);
//   }

//   function createNewUserId() {
//     let id = '';
//     let asciiCharsLowest = 33;
//     let asciiCharsHighest = 123;
//     let idLength = 9;

//     for (let i = 0; i < idLength; i++) {
//       let charCode = Math.floor(Math.random() * (asciiCharsHighest - asciiCharsLowest)) + asciiCharsLowest;
//       id += String.fromCharCode(charCode);
//     }

//     let doesIdExist = this.getIdIndex(id) === -1;
//     return (doesIdExist) ? id : this.createNewUserId();
//   }

//   function saveToDatabase(users) {
//     localStorage.setItem('roppProjectUserDatabase', users);
// 	}

// 	return {
// 		getUsers: getUsers
// 	}

// })();
