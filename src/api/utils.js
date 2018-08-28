class ValidateUtil {
  static formatPhoneNumber(phoneNumber) {
    let numberArray = phoneNumber.split("").reverse();

    let domestic = this.insertDomesticSymbols(numberArray);
    let international = this.insertInternationalSymbols(domestic);
    let formattedForDisplay = international.reverse().join("");

    return formattedForDisplay;
  }

  static insertDomesticSymbols(phoneArray) {
    let domesticSymbols = [
      { name: "dash", loc: 4, text: "-" },
      { name: "spaceLoc", loc: 8, text: " " },
      { name: "leftParLoc", loc: 9, text: ")" },
      { name: "rightParLoc", loc: 13, text: "(" }
    ];

    domesticSymbols.forEach(symbol => {
      phoneArray.splice(symbol.loc, 0, symbol.text);
    });

    return phoneArray;
  }

  static insertInternationalSymbols(numberArray) {
    let domesticNumberLength = 14;
    let isInternationalNumber = numberArray.length > domesticNumberLength;
    let internationalSpaceLoc = 14;
    let internationalNumPre = "+";

    if (isInternationalNumber) {
      numberArray.splice(internationalSpaceLoc, 0, " ");
      numberArray.push(internationalNumPre);
    }
    return numberArray;
  }

  static checkPhoneInput(phone) {
    let phoneDigits = phone.replace(/\D/g, "");
    let internationalDigitMax = 13;
    let domesticDigitLength = 10;

    return (
      phoneDigits.length >= domesticDigitLength &&
      phoneDigits.length <= internationalDigitMax
    );
  }

  static checkEmailInput(email) {
    let emailFormat = /^\S+@\S+\.\S+$/;
    return emailFormat.test(email);
  }
}

module.exports = ValidateUtil;
