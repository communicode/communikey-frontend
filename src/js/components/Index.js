import React from "react";
import Navbar from "./Navbar";

export default class Index extends React.Component {
  render() {
    return (
      <Navbar>
        {this.props.children}
      </Navbar>
    )
  }
}
