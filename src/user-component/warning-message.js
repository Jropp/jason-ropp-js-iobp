import { Element as PolymerElement } from "@banno/polymer/polymer-element.js"; // eslint-disable-line no-unused-vars
// import { ValidateUtil } from './../api/utils.js';
class WarningMessageElement extends PolymerElement {
  static get is() {
    return "warning-message";
  }
}

customElements.define(WarningMessageElement.is, WarningMessageElement);
export default WarningMessageElement;
