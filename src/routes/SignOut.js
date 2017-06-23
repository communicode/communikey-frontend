import React from "react";
import {Redirect} from "react-router-dom";
import {inject, PropTypes as MobxPropTypes} from "mobx-react";
import {AUTH_STORE} from "../stores/storeConstants";

@inject(AUTH_STORE)
class SignOut extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    localStorage.clear();
    this.props.authStore._reset();
  }

  render() {
    return <Redirect to="/signin"/>;
  }
}

export default SignOut;

SignOut.propTypes = {
  /**
   * @type {ObservableArray} authStore - The injected authentication store
   */
  authStore: MobxPropTypes.observableArray
};

