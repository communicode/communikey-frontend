import React from "react";
import {Redirect} from "react-router-dom";
import {inject, PropTypes as MobxPropTypes} from "mobx-react";
import {ROUTE_SIGNIN} from "./routeMappings";
import PropTypes from "prop-types";
import {AUTH_STORE} from "../stores/storeConstants";
import {webSocketService} from "../Communikey";

@inject(AUTH_STORE)
class SignOut extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    webSocketService.close();
    localStorage.clear();
    this.props.authStore._reset();
  }

  render() {
    if (this.props.location.state) {
      return (
        <Redirect to={{
          pathname: ROUTE_SIGNIN,
          state: { forward: this.props.location.state.forward }
        }}/>
      );
    } else {
      return <Redirect to={ROUTE_SIGNIN}/>;
    }
  }
}

export default SignOut;

SignOut.propTypes = {
  /**
   * @type {ObservableArray} authStore - The injected authentication store
   */
  authStore: MobxPropTypes.observableArray,

  /**
   * @type {object} location - The location object of the react router
   */
  location: PropTypes.object
};

