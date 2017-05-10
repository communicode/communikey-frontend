import React from "react";
import Navbar from "./Navbar";

class Index extends React.Component {
  render() {
    return (
      <Navbar>
        {this.props.children}
      </Navbar>
    )
  }
}

export default Index;
