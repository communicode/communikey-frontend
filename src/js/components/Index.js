import React from "react";
import Navbar from "./Navbar";
import "../../css/components/Index.css";

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Navbar>
          {this.props.children}
        </Navbar>
      </div>
    )
  }
}
