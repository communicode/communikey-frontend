import React from "react";
import CategoryTree from "./CategoryTree";
import {} from 'semantic-ui-react'
import AuthenticatedRoute from "./AuthenticatedRoute";

class Categories extends AuthenticatedRoute {
  render() {
    return (
      <CategoryTree/>
    )
  }
}

export default Categories;
