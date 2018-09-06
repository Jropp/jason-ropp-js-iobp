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

// create fallback defaults for each one

class SortUtil {
  static compareUsers(a, b, filters) {
    let i = 0;
    let compared = 0;

    filters.forEach(filter => {
      if (a[`${filters[i]}`] === b[`${filters[i]}`]) {
        i++;
      } else {
        compared = a[`${filters[i]}`] > b[`${filters[i]}`] ? 1 : -1;
      }
      if (i + 1 === filters.length) {
        return;
      }
    });

    return compared;
  }

  static sortUsersByMultiple(users) {
    let sortFilters = this.getFiltersUsed(arguments);

    let sorted = users.sort((a, b) => {
      return this.compareUsers(a, b, sortFilters);
    });

    return sorted;
  }

  static getFiltersUsed(args) {
    let usedArgs = [];
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      usedArgs.push(arg);
    }
    return usedArgs;
  }
}

module.exports = {
  ValidateUtil: ValidateUtil,
  SortUtil: SortUtil
};
