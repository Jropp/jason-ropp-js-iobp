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
  static sortUsersByMultiple(users, primary, secondary, tertiary) {
    let sorted = users.sort((a, b) => {
      if (a[primary] === b[primary]) {
        if (a[secondary] === b[secondary]) {
          if (a[tertiary] === b[tertiary]) {
            return 0;
          } else {
            return a[tertiary] > b[tertiary] ? 1 : -1;
          }
        } else {
          return a[secondary] > b[secondary] ? 1 : -1;
        }
      } else {
        return a[primary] > b[primary] ? 1 : -1;
      }
    });

    return sorted;
  }
}

module.exports = {
  ValidateUtil: ValidateUtil,
  SortUtil: SortUtil
};
