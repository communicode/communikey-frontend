import React from "react";
import {Redirect} from "react-router-dom";
import {inject} from "mobx-react";
import {AUTH_STORE} from "../stores/storeConstants";

@inject(AUTH_STORE)
class SignOut extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    localStorage.clear();
    this.props.authStore.reset();
  }

  render() {
    return <Redirect to="/signin"/>;
  }
}

export default SignOut;

