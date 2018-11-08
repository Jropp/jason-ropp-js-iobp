const phoneSettings = {
  DOMESTIC_LENGTH: 10,
  INTERNATIONAL_MAX_LENGTH: 13,
  INTERNATIONAL_LENGTH: (length) => {return length > this.DOMESTIC_LENGTH},
  DOMESTIC_SYMBOLS: [
    { name: 'dash', loc: 4, text: '-' },
    { name: 'spaceLoc', loc: 8, text: ' ' },
    { name: 'leftParLoc', loc: 9, text: ')' },
    { name: 'rightParLoc', loc: 13, text: '(' }
  ],
  INTERNATIONAL_SYMBOLS: [
    { name: 'intPre', loc: reversedPhoneArray.length, text: '+' },
    { name: 'intSpace', loc: 14, text: ' ' }
  ]
}
export class ValidateUtil {
  static formatPhoneNumber(phoneNumber) {
    const reversedPhoneArray = phoneNumber.split('').reverse();
    const domFormatted = this.insertDomesticSymbols(reversedPhoneArray);
    let displayFormat;

    if (this.INTERNATIONAL_LENGTH(phoneNumber.length)) {
      const intFormatted = this.insertInternationalSymbols(domFormatted);
      displayFormat = intFormatted.reverse().join('');
    } else {
      displayFormat = domFormatted.reverse().join('');
    }

    return displayFormat;
  }

  static insertDomesticSymbols(reversedPhoneArray) {
    this.phoneSettings.DOMESTIC_SYMBOLS.forEach(symbol => {
      reversedPhoneArray.splice(symbol.loc, 0, symbol.text);
    });

    return reversedPhoneArray;
  }

  static insertInternationalSymbols(reversedPhoneArray) {
    this.phoneSettings.INTERNATIONAL_SYMBOLS.forEach(symbol => {
      reversedPhoneArray.splice(symbol.loc, 0, symbol.text);
    });

    return reversedPhoneArray;
  }

  static checkPhoneInput(phone) {
    const phoneDigits = phone.replace(/\D/g, '');
    const internationalDigitMax = 13;
    const domesticDigitLength = 10;
    const validNumberLength =
      phoneDigits.length >= domesticDigitLength &&
      phoneDigits.length <= internationalDigitMax;

    return validNumberLength;
  }

  static checkEmailInput(email) {
    const emailFormat = /^\S+@\S+\.\S+$/;
    return emailFormat.test(email);
  }
}

// module.exports = ValidateUtil;
