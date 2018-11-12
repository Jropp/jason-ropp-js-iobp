export class ValidateUtil {
  static get phoneSettings() {
    return {
      DOMESTIC_LENGTH: 10,
      INTERNATIONAL_MAX_LENGTH: 13,
      DOMESTIC_SYMBOLS: [
        { name: 'dash', loc: 4, text: '-' },
        { name: 'spaceLoc', loc: 8, text: ' ' },
        { name: 'leftParLoc', loc: 9, text: ')' },
        { name: 'rightParLoc', loc: 13, text: '(' }
      ],
      INTERNATIONAL_SYMBOLS: [{ name: 'intSpace', loc: 14, text: ' ' }],
      _isInternational: length => {
        return length > this.phoneSettings.DOMESTIC_LENGTH;
      }
    };
  }

  static formatPhoneNumber(phoneNumber) {
    const reversedPhoneArray = phoneNumber.split('').reverse();
    const domFormatted = this.insertDomesticSymbols(reversedPhoneArray);

    let displayFormat;
    if (this.phoneSettings._isInternational(phoneNumber.length)) {
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

    const validNumberLength =
      phoneDigits.length >= this.phoneSettings.DOMESTIC_LENGTH &&
      phoneDigits.length <= this.phoneSettings.INTERNATIONAL_MAX_LENGTH;

    return validNumberLength;
  }

  static checkEmailInput(email) {
    const emailFormat = /^\S+@\S+\.\S+$/;
    return emailFormat.test(email);
  }
}
