import React from "react";
// import {Link} from "react-router-dom";
import {Col, Card, Icon} from "antd";
import "antd/lib/col/style/css";
import "antd/lib/card/style/css";
import "./TutorialWidget.less";
import {ROUTE_KEYS} from "../../../routes/routeMappings";
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
          <Link to={ROUTE_KEYS}>
            <Card className="info-card">
              <Icon type="lock" className="icon"/>
              <h1>
                You and your private key
              </h1>
              <p>
                Your private key secures all your keys and actions on this site. Its crucial for
                everyday operation and should be taken care of very carefully!<br/>
                Make sure to enter the keypair wizard and setup your private & public key.
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
                Get started with adding your first key!
                Click here to get an introduction into key creation and
                basic management.<br/>
                Make sure that you´ve set your private key first or
                you wont be able to create new keys.
              </p>
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link to={ROUTE_KEYS}>
            <Card className="info-card">
              <Icon type="folder-open" className="icon"/>
              <h1>
                Everything about categories
              </h1>
              <p>
                Learn everything about advanced category and key management.
                Adding your created keys into categories ensures an overseeable key pool and
                only certain users, selected by you, have access to said keys. <br/><br/>
                This tutorial contains basic creation of categories and permission
                management.
              </p>
            </Card>
          </Link>
        </Col>
      </div>
    );
  }
}

export default TutorialWidget;
