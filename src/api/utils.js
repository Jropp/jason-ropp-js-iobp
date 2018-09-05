class ValidateUtil {
  static formatPhoneNumber(phoneNumber) {
    let domesticPhoneLength = 10;
    let isInternationalNumber = phoneNumber.length > domesticPhoneLength;
    let reversedPhoneArray = phoneNumber.split("").reverse();

    let domFormatted = this.insertDomesticSymbols(reversedPhoneArray);
    let displayFormat;

    if (isInternationalNumber) {
      let intFormatted = this.insertInternationalSymbols(domFormatted);
      displayFormat = intFormatted.reverse().join("");
    } else {
      displayFormat = domFormatted.reverse().join("");
    }

    return displayFormat;
  }

  static insertDomesticSymbols(reversedPhoneArray) {
    let domesticSymbols = [
      { name: "dash", loc: 4, text: "-" },
      { name: "spaceLoc", loc: 8, text: " " },
      { name: "leftParLoc", loc: 9, text: ")" },
      { name: "rightParLoc", loc: 13, text: "(" }
    ];

    domesticSymbols.forEach(symbol => {
      reversedPhoneArray.splice(symbol.loc, 0, symbol.text);
    });

    return reversedPhoneArray;
  }

  static insertInternationalSymbols(reversedPhoneArray) {
    let internationalSymbols = [
      { name: "intPre", loc: reversedPhoneArray.length, text: "+" },
      { name: "intSpace", loc: 14, text: " " }
    ];

    internationalSymbols.forEach(symbol => {
      reversedPhoneArray.splice(symbol.loc, 0, symbol.text);
    });

    return reversedPhoneArray;
  }

  static checkPhoneInput(phone) {
    let phoneDigits = phone.replace(/\D/g, "");
    let internationalDigitMax = 13;
    let domesticDigitLength = 10;
    let validNumberLength =
      phoneDigits.length >= domesticDigitLength &&
      phoneDigits.length <= internationalDigitMax;

    return validNumberLength;
  }

  static checkEmailInput(email) {
    let emailFormat = /^\S+@\S+\.\S+$/;
    return emailFormat.test(email);
  }
}

class SortUtil {
  static sortUsersBy(filter, users) {
    let sorted = users.sort((a, b) => {
      let first = a[filter];
      let second = b[filter];

      if (first === second) {
        return 0;
      } else {
        return first > second ? 1 : -1;
      }
    });

    return sorted;
  }

  static sortUsersByLastName(users) {
    let sorted = users.sort((a, b) => {
      if (a.last === b.last) {
        if (a.first === b.first) {
          return 0;
        } else {
          return a.first > b.first ? 1 : -1;
        }
      } else {
        return a.last > b.last ? 1 : -1;
      }
    });

    return sorted;
  }
  static sortUsersByFirstName(users) {
    let sorted = users.sort((a, b) => {
      if (a.first === b.first) {
        if (a.last === b.last) {
          return 0;
        } else {
          return a.last > b.last ? 1 : -1;
        }
      } else {
        return a.first > b.first ? 1 : -1;
      }
    });

    return sorted;
  }

  static sortUsersByDepartment(users) {
    let sorted = users.sort((a, b) => {
      console.log(a.department, b.department);
      if (a.department === b.department) {
        if (a.last === b.last) {
          if (a.first === b.first) {
            return 0;
          } else {
            return a.first > b.first ? 1 : -1;
          }
        } else {
          return a.last > b.last ? 1 : -1;
        }
      } else {
        return a.department > b.department ? 1 : -1;
      }
    });

    return sorted;
  }
}

module.exports = {
  ValidateUtil: ValidateUtil,
  SortUtil: SortUtil
};
