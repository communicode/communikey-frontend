import React, { Component } from 'react'
import { Link } from 'react-router'
import { Sidebar, Segment, Menu, Image, Icon } from 'semantic-ui-react'
import "../../css/components/Navbar.css";
import * as constants from '../util/Constants'

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      activeItem: 'home',
      visibleAdmin: false
    };
  }

  handleItemClick = (e, { name }) => this.setState({
    activeItem: name
  });

  toggleSubMenu = (menu) => {
    if (this.state.visibleAdmin) {
      this.setState({
        [menu]: false
      });
    } else {
      this.setState({
        [menu]: true
      });
    }
  };

  render() {
    const { visible, activeItem} = this.state;
    return (
      <Sidebar.Pushable as={Segment} class="frame">
        <Sidebar as={Menu} animation='overlay' width='thin' visible={visible} icon='labeled' vertical inverted>
          <Link to="home">
            <div class="navbarLogo">
              <Image src='/assets/img/communikey-logo_transparent.svg' size="tiny"/>
            </div>
          </Link>
          <Link to={"/" + constants.FRONTEND_HOME}>
            <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}>
              <Icon name='home' />
              Home
            </Menu.Item>
          </Link>
          <Link to={"/" + constants.FRONTEND_CATEGORIES}>
            <Menu.Item name='categories' active={activeItem === 'categories'} onClick={this.handleItemClick}>
              <Icon name='tags' />
              Categories
            </Menu.Item>
          </Link>
          <Link to={"/" + constants.FRONTEND_SETTINGS}>
            <Menu.Item name='settings' active={activeItem === 'settings'} onClick={this.handleItemClick}>
              <Icon name='settings' />
              Settings
            </Menu.Item>
          </Link>
          <Link to={"/" + constants.FRONTEND_ABOUT}>
            <Menu.Item name='about' active={activeItem === 'about'} onClick={this.handleItemClick}>
              <Icon name='info' />
              About
            </Menu.Item>
          </Link>
          <div>
            <Menu.Item name='Management' onClick={() => this.toggleSubMenu("visibleAdmin")}>
              <Icon name='legal' />
              Management
            </Menu.Item>
          </div>
          {
            this.state.visibleAdmin &&
            <div>
              <Link to={"/" + constants.FRONTEND_MANAGEMENT + "/" + constants.FRONTEND_USER}>
                <Menu.Item class="dropdown" name='UserManagement' active={activeItem === 'UserManagement'} onClick={this.handleItemClick}>
                  Users
                </Menu.Item>
              </Link>
              <Link to={"/" + constants.FRONTEND_MANAGEMENT + "/" + constants.FRONTEND_CATEGORY}>
                <Menu.Item class="dropdown" name='CategoryManagement' active={activeItem === 'CategoryManagement'} onClick={this.handleItemClick}>
                  Categories
                </Menu.Item>
              </Link>
            </div>
          }
          <Link to={"/" + constants.FRONTEND_LOGOUT}>
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

export default Navbar;
