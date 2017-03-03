import React, { Component } from 'react'
import { Image } from 'semantic-ui-react'

import "../../css/components/Header.css";

class Header extends Component {
    render() {
        return (
          <div class="headerBar">
              <div class="logo">
                  <Image src='../../img/communikey-logo_transparent.svg'/>
              </div>
          </div>
        )
    }
}

export default Header
