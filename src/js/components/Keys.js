import React from "react";
import CategoryTree from "./CategoryTree";
import {} from 'semantic-ui-react'
import AuthenticatedRoute from "./AuthenticatedRoute";

class Keys extends AuthenticatedRoute {
  render() {
    return (
      <CategoryTree/>
    )
  }
}

export default Keys;
