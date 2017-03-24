import React, { Component } from 'react'
import { Image, Icon, Menu } from 'semantic-ui-react'
import "../../css/components/NavBar.css";

export default class NavBar extends Component {
  state = { activeItem: 'home' }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render() {
    const { activeItem } = this.state
    return (
      <div class="navbar">
        ASD
      </div>
    )
  }
}
