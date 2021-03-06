/*
 * This file is part of communikey.
 * Copyright (C) 2016-2018  communicode AG <communicode.de>
 *
 * communikey is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React from "react";
// import {Link} from "react-router-dom";
import {Col, Card, Icon} from "antd";
import "antd/lib/col/style/css";
import "antd/lib/card/style/css";
import "./TutorialWidget.less";
import {ROUTE_KEYS, ROUTE_WIZARD} from "../../../routes/routeMappings";
import {Link} from "react-router-dom";

/**
 * The tutorial widget that tries
 * to give tips for the first steps
 * in the webapp.
 *
 * @author dvonderbey@communicode.de
 * @author lleifermann@communicode.de
 * @since 0.15.0
 */
class TutorialWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="widget-tutorial">
        <Col span={8}>
          <Link to={ROUTE_WIZARD}>
            <Card className="info-card">
              <Icon type="lock" className="icon"/>
              <h1>
                Your personal key pair
              </h1>
              <p>
                Your private key secures all your keys and actions here and is needed to
                properly use this tool.<br/>
                Please make sure to enter the keypair wizard by clicking on your account name in the
                upper right to setup your personal key pair.
              </p>
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link to={ROUTE_KEYS}>
            <Card className="info-card">
              <Icon type="key" className="icon"/>
              <h1>
                Get started with keys
              </h1>
              <p>
                Have a look at your personal keys page. It will show all the keys you&#39;re
                allowed to see.<br/>If you want to access the plain text passwords, please make
                sure you installed a private key. Otherwise it won&#39;t work.<br/>
                Please note that new keys must first be encrypted for you by other users and this
                could take some time until this person is online. If you need fast access please
                contact:<br/><br/>
                <b>key@communicode.de</b>
              </p>
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link to={ROUTE_KEYS}>
            <Card className="info-card">
              <Icon type="folder-open" className="icon"/>
              <h1>
                Category structure
              </h1>
              <p>
                All your keys are sorted by categories. These categories are thematically bound
                so you will only see the keys you&#39;ll need.
                If you miss a key contact:<br/><br/>
                <b>key@communicode.de</b>
              </p>
            </Card>
          </Link>
        </Col>
      </div>
    );
  }
}

export default TutorialWidget;
