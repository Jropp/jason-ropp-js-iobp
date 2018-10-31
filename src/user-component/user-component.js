import { Element as PolymerElement } from '@banno/polymer/polymer-element.js'; // eslint-disable-line no-unused-vars

class UserComponentElement extends PolymerElement {
  static get is() { return 'user-component'; }
  static get properties() {
    return {
      userToDisplay: {
        type: Object,
        observer: 'userUpdated'
      },
      user: {
        type: Object,
        value: () => {
          return {
            first: '',
            last: '',
            phone: '',
            email: '',
            department: '',
            id: ''
          };
        },
      },
      // edit, display
      mode: {
        type: String,
      },
      modes: {
        type: Object,
        value: () => {
          return {
            DISPLAY: 'display',
            EDIT_USER: 'edit',
            CREATE_NEW: 'create'
          };
        },
      },
      userCardClass: {
        type: String,
      },
      classes: {
        type: Object,
        value: () => {
          return {
            COLLAPSE_NEW: 'default-card collapse-new-user',
            ANIMATE_COLLAPSE_USER: 'default-card collapse-existing-user',
            IMMEDIATELY_COLLAPSE_USER: 'default-card immediately-collapse-existing-user',
            IMMEDIATELY_EXPAND_USER: 'default-card immediately-expand-existing-user',
            EXPAND_NEW: 'default-card expand-new-user',
            ANIMATE_EXPAND_USER: 'default-card expand-existing-user',
          };
        },
      },
      displayOpenEditMessage: {
        type: Boolean
      },
      displayPhoneWarning: {
        type: Boolean
      },
      displayEmailWarning: {
        type: Boolean
      },
      messages: {
        type: Object,
        value: () => {
          return {
            OPEN_EDIT: 'You are safe to save this once the other open edits are closed.',
            PHONE_FORMAT: 'Would you mind formatting your number as (xxx) xxx-xxxx?',
            EMAIL_FORMAT: 'Your email seems a little off. Would you mind formatting it as xxxx@xxxxx.xxx?'
          };
        },
      },
      disableSave: {
        type: Boolean,
        value: true,
      },
      editOpen: {
        type: Boolean,
        value: false,
        observer: 'onEditOpenChanged'
      },
      isExpanded: {
        type: Boolean,
        observer: 'setUserDetailsDisplay'
      },
      isFirstLoad: {
        type: Boolean,
        value: true
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.initCardState();
  }

  initCardState() {
    let isExistingUser = Boolean(this.user._id);

    if (isExistingUser) {
      this.setProperties({
        userCardClass: this.classes.ANIMATE_COLLAPSE_USER,
        mode: this.modes.DISPLAY
      });
      this.toggleEditableInputs();
    } else {
      this.setProperties({
        userCardClass: this.classes.COLLAPSE_NEW,
        mode: this.modes.CREATE_NEW
      });
    }
  }

  ready() {
    super.ready();
    this.isFirstLoad = false;
    this.importClasses();
  }

  importClasses() {
    require.ensure(
      ['./../api/utils', './../api/user-database'],
      (require) => {
        window.ValidateUtil = require('./../api/utils').ValidateUtil;
        window.Database = require('./../api/user-database').Database;
      },
      (error) => {
        return error;
      },
      'Classes'
    ).then(() => {
      this.formatUserData();
    });
  }

  userUpdated(newUser) {
    this.formatUserData(newUser);
    this.user = newUser;
  }

  formatUserData(newUser) {
    const user = newUser ? newUser : Object.assign({}, this.user);
    const isExistingUser = this.user._id;
    const phoneNumHasSymbols = user.phone.match(/\D/);

    if (!phoneNumHasSymbols && isExistingUser) {
      user.phone = ValidateUtil.formatPhoneNumber(user.phone); // eslint-disable-line no-undef
    }

    this.user = user;
  }

  save(e) {
    e.preventDefault();

    if (this.hasInvalidFormInputs()) {
      this.updateWarningMessageDisplay();
      this.updateDisableSaveButton();
      return;
    }

    const user = Object.assign({}, this.user);

    if (this.isMode(this.modes.CREATE_NEW)) {
      Database.saveUser(user); // eslint-disable-line no-undef
    } else {
      this.toggleDetailsVisibility();
      Database.editUser(user); // eslint-disable-line no-undef
    }

    this.resetFormState();
  }

  delete(e) {
    e.preventDefault();

    Database.deleteUser(this.user); // eslint-disable-line no-undef
    this.toggleEditDisplayMode();
    this.toggleDetailsVisibility();
    this.clearInputFormatWarnings();
  }

  onInputChanged() {
    if (!this.isFirstLoad) {
      this.updateDisableSaveButton();
      this.updateWarningMessageDisplay();
    }
  }

  onEditOpenChanged() {
    if (!this.isFirstLoad) {
      this.updateDisableSaveButton();
      this.updateWarningMessageDisplay();
    }
  }

  hasInvalidFormInputs() {
    const editOpenAndNewUser =
      this.editOpen && this.isMode(this.modes.CREATE_NEW);
      const emptyFields = !this.areFieldsFilled();
      // eslint-disable-next-line no-undef
      const improperPhoneFormat = !ValidateUtil.checkPhoneInput(this.user.phone);
      // eslint-disable-next-line no-undef
      const improperEmailFormat = !ValidateUtil.checkEmailInput(this.user.email);

    return (
      editOpenAndNewUser ||
      emptyFields ||
      improperPhoneFormat ||
      improperEmailFormat
    );
  }

  updateDisableSaveButton() {
    if (!this.isFirstLoad) {
      this.disableSave = this.hasInvalidFormInputs();
    }
  }

  updateWarningMessageDisplay() {
    const isNewUserCard = this.isMode(this.modes.CREATE_NEW);
    const emailInProgress = this.user.email;
    const phoneInProgress = this.user.phone;

    const emailWarning = emailInProgress && !ValidateUtil.checkEmailInput(this.user.email);
    const phoneWarning = phoneInProgress && !ValidateUtil.checkPhoneInput(this.user.phone);
    const openEditMessage = isNewUserCard && this.editOpen;

    this.setProperties({
      displayEmailWarning: emailWarning,
      displayPhoneWarning: phoneWarning,
      displayOpenEditMessage: openEditMessage
    });

    const errorMessageDisplayed = this.displayEmailWarning || this.displayPhoneWarning || this.displayOpenEditMessage;

    if (errorMessageDisplayed) {
      this.resizeCardForWarningMessages(true);
    }
  }

  clearInputFormatWarnings() {
    this.setProperties({
      displayEmailWarning: false,
      displayPhoneWarning: false
    });

    this.resizeCardForWarningMessages(false);
  }

  areFieldsFilled() {
    const fields = this.shadowRoot.querySelectorAll('input');
    let fieldsFilled = true;

    fields.forEach(field => {
      if (!field.value.length) {
        fieldsFilled = false;
        return; // eslint-disable-line no-useless-return
      }
    });

    return fieldsFilled;
  }

  toggleDetailsVisibility() {
    this.isExpanded = !this.isExpanded;
    this.setUserDetailsDisplay();
    this.saveCardState();
  }

  saveCardState() {
    this.dispatchEvent(new CustomEvent('cardDetailDisplayChanged', {
      bubbles: true,
      composed: true,
      detail: { id: this.user._id, expanded: this.isExpanded }
    }));
  }

  setUserDetailsDisplay(event) {
    const eventIsUserListUpdate = (typeof event === 'boolean');
    const animationStyle = eventIsUserListUpdate ? 'IMMEDIATELY' : 'ANIMATE';

    const expand = this.classes[`${animationStyle}_EXPAND_USER`];
    const collapse = this.classes[`${animationStyle}_COLLAPSE_USER`];

    this.userCardClass = this.isExpanded ? expand : collapse;
  }

  setDetailsArrowDirection() {
    const arrowIsDown = this.userCardClass.match(/collapse/g);
    return arrowIsDown;
  }

  editInProgress(bool) {
    this.dispatchEvent(new CustomEvent('editButtonClicked', {
      bubbles: true,
      composed: true,
      detail: {editInProgress: bool}
    }));
  }

  toggleEditDisplayMode(isButtonClick) {
    if (isButtonClick) {
      isButtonClick.preventDefault();
    }

    this.mode = this.isMode(this.modes.EDIT_USER) ? this.modes.DISPLAY : this.modes.EDIT_USER;

    this.editInProgress(this.isMode(this.modes.EDIT_USER));
    this.toggleEditableInputs();
  }

  toggleEditableInputs() {
    this.shadowRoot.querySelectorAll('input')
      .forEach(input => {
        input.readOnly = this.isMode(this.modes.DISPLAY);
      });
  }

  resetFormState() {
    if (this.isMode(this.modes.EDIT_USER)) {
      this.toggleEditDisplayMode();
    } else {
      this.toggleNewUserFormDisplay();
    }

    this.clearInputFormatWarnings();
  }

  toggleNewUserFormDisplay() {
    const collapsed = this.classes.COLLAPSE_NEW;
    const expanded = this.classes.EXPAND_NEW;

    this.userCardClass = this.isClass(collapsed) ? expanded : collapsed;

    if (this.isClass(collapsed)) {
      this.resetNewUserForm();
    }
  }

  resetNewUserForm() {
    this.shadowRoot.querySelector('form').reset();
    this.clearInputFormatWarnings();
  }

  resizeCardForWarningMessages(expandForMessages) {
    if (expandForMessages) {
      this.$.userCard.style.height = 'auto';
    } else {
      this.$.userCard.style = '';
    }
  }

  isMode(expectedMode) {
    return expectedMode === this.mode;
  }

  isClass(expectedClass) {
    return expectedClass === this.userCardClass;
  }

}

customElements.define(UserComponentElement.is, UserComponentElement);
export default UserComponentElement;
