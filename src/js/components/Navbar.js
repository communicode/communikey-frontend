import React, { Component } from 'react'
import { Link } from 'react-router'
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'
import "../../css/components/Navbar.css";

class Navbar extends Component {
  state = {
            visible: true,
            activeItem: 'home'
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible })
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { visible } = this.state
    const { activeItem } = this.state
    return (
      <div>
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation='push' width='thin' visible={visible} icon='labeled' vertical inverted>
            <Link to="home">
              <div class="header">
                <Image src='../../img/communikey-logo_transparent.svg' size="tiny"/>
              </div>
            </Link>
            <Link to="home">
              <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}>
                <Icon name='home' />
                Home
              </Menu.Item>
            </Link>
            <Link to="categories">
              <Menu.Item name='categories' active={activeItem === 'categories'} onClick={this.handleItemClick}>
                <Icon name='tags' />
                Categories
              </Menu.Item>
            </Link>
            <Link to="settings">
              <Menu.Item name='settings' active={activeItem === 'settings'} onClick={this.handleItemClick}>
                <Icon name='settings' />
                Settings
              </Menu.Item>
            </Link>
            <Link to="about">
              <Menu.Item name='about' active={activeItem === 'about'} onClick={this.handleItemClick}>
                <Icon name='info' />
                About
              </Menu.Item>
            </Link>
            <Link to="admin">
              <Menu.Item name='admin' active={activeItem === 'admin'} onClick={this.handleItemClick}>
                <Icon name='warning sign' />
                Admin menu
              </Menu.Item>
          </Link>
            <div class="footer">
              Version 0.3.0
            </div>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              {this.props.children}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}

export default Navbar
