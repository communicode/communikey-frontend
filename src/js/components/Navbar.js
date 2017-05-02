import React, { Component } from 'react'
import { Link } from 'react-router'
import { Sidebar, Segment, Menu, Image, Icon } from 'semantic-ui-react'
import "../../css/components/Navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      activeItem: 'home',
      visibleAdmin: false
    }
    this.toggleSubMenu = this.toggleSubMenu.bind(this)
  }

  toggleSubMenu = () => {const {visibleAdmin} = this.state; this.setState({visibleAdmin: !visibleAdmin})}
  toggleVisibility = () => this.setState({ visible: !this.state.visible })
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { visible } = this.state
    const { activeItem } = this.state
    return (
      <Sidebar.Pushable as={Segment} class="frame">
        <Sidebar as={Menu} animation='overlay' width='thin' visible={visible} icon='labeled' vertical inverted>
          <Link to="home">
            <div class="navbarLogo">
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
          <Link >
            <Menu.Item name='admin' onClick={this.toggleSubMenu}>
              <Icon name='warning sign' />
              Admin menu
            </Menu.Item>
          </Link>
          {this.state.visibleAdmin &&
            <div>
              <Link to="admin">
                <Menu.Item class="dropdown" name='admin' active={activeItem === 'admin'} onClick={this.handleItemClick}>
                  User
                </Menu.Item>
              </Link>
            </div>
          }
          <Link to="logout">
            <Menu.Item name='logout' active={activeItem === 'logout'} onClick={this.handleItemClick}>
              <Icon name='sign out' />
              Logout
            </Menu.Item>
          </Link>
          <Menu.Item class="version">
            Version 0.3.0
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher class="page">
          <Segment class="pageContent" basic>
            {this.props.children}
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

export default Navbar
