export { email };

let phone = (() => {
  function insertPhoneSymbols(phoneNumber) {
    let phoneArray = phoneNumber.split("");
    phoneArray = phoneArray.reverse();
    let domesticSymbols = [
      { name: "dash", loc: 4, text: "-" },
      { name: "spaceLoc", loc: 8, text: " " },
      { name: "leftParLoc", loc: 9, text: ")" },
      { name: "rightParLoc", loc: 13, text: "(" }
    ];

    domesticSymbols.forEach(symbol => {
      phoneArray.splice(symbol.loc, 0, symbol.text);
    });

    let domesticNumCharLength = 14;
    let interSpaceLoc = 14;
    if (phoneArray.length > domesticNumCharLength) {
      phoneArray.splice(interSpaceLoc, 0, " ");
      let internationalNumPre = "+";
      phoneArray.push(internationalNumPre);
    }

    phoneArray = phoneArray.reverse();
    return phoneArray.join("");
  }

  function checkPhoneInput(phone) {
    let phoneDigits = phone.replace(/\D/g, "");
    let internationalDigitMax = 13;
    let domesticDigitLength = 10;

    return (
      phoneDigits.length >= domesticDigitLength &&
      phoneDigits.length <= internationalDigitMax
    );
  }

  return {
    insertPhoneSymbols: insertPhoneSymbols,
    checkPhoneInput: checkPhoneInput
  };
})();

let email = (() => {
  function checkEmailInput() {
    let emailFormat = /^\S+@\S+\.\S+$/;
    return emailFormat.test(this.user.email);
  }

  return {
    checkEmailInput: checkEmailInput
  };
})();
