class ValidateUtil {
  static insertPhoneSymbols(phoneNumber) {
    let phoneArray = phoneNumber.split("");
    let reversedNumber = phoneArray.reverse();

    let domesticNumCharLength = 14;
    let domesticSymbols = [
      { name: "dash", loc: 4, text: "-" },
      { name: "spaceLoc", loc: 8, text: " " },
      { name: "leftParLoc", loc: 9, text: ")" },
      { name: "rightParLoc", loc: 13, text: "(" }
    ];
    let interSpaceLoc = 14;
    let internationalNumPre = "+";

    domesticSymbols.forEach(symbol => {
      reversedNumber.splice(symbol.loc, 0, symbol.text);
    });

    if (phoneArray.length > domesticNumCharLength) {
      reversedNumber.splice(interSpaceLoc, 0, " ");
      reversedNumber.push(internationalNumPre);
    }

    phoneArray = reversedNumber.reverse();
    return phoneArray.join("");
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
