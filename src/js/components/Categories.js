import React from "react";
import KeyCard from "./KeyCard";
import CategoryTree from "./CategoryTree";
import { Card, Grid, Segment, Divider } from 'semantic-ui-react'

export default class Categories extends React.Component {
  render() {
    return (
      <CategoryTree/>
    )
  }
}
