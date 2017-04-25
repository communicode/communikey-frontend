import React from "react";
import KeyCard from "./KeyCard";
import CategoryTree from "./CategoryTree";
import { Card, Grid, Segment, Divider } from 'semantic-ui-react'
import AuthenticatedRoute from "./AuthenticatedRoute";

export default class Categories extends AuthenticatedRoute {
  render() {
    return (
      <CategoryTree/>
    )
  }
}
