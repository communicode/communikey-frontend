/*
 * This file is part of communikey.
 * Copyright (C) 2016-2018  communicode AG <communicode.de>
 *
 * communikey is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
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
