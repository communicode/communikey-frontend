import React from "react";
import AuthenticatedRoute from "./AuthenticatedRoute";
import "../../css/components/Index.css";

export default class Home extends AuthenticatedRoute {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        Home Test
      </div>
    )
  }
}
