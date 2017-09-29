import {action, observable} from "mobx";

/**
 * An observable helper for invocation of modals
 *
 * @author dvonderbey@communicode.de
 * @since 0.15.0
 */
class InvocationHelper {
  @observable showProfileModal;
  @observable showWizard;

  /**
   * Constructs the invocation helper
   */
  constructor() {
    this.showProfileModal = false;
    this.showWizard = false;
  }

  @action("InvocationHelper_setProfileModalState")
  setProfileModalState = (state) => {
    this.showProfileModal = state;
  };

  @action("InvocationHelper_toggleProfileModalState")
  toggleProfileModalState = () => {
    this.showProfileModal
      ? this.showProfileModal = false
      : this.showProfileModal = true;
  };

  @action("InvocationHelper_setWizardState")
  setWizardState = (state) => {
    this.showWizard = state;
  }
}

export default InvocationHelper;
