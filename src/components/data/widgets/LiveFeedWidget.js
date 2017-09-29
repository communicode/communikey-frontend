import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Col, Card, Timeline, Icon} from "antd";
import {EVENT_STORE} from "../../../stores/storeConstants";
import {inject, observer, PropTypes as MobXPropTypes} from "mobx-react";
import "antd/lib/col/style/css";
import "antd/lib/card/style/css";
import "antd/lib/timeline/style/css";
import "antd/lib/icon/style/css";
import "./LiveFeedWidget.less";

/**
 * The live feed widget displaying events
 * from the event store on the dashboard.
 *
 * @author dvonderbey@communicode.de
 * @author lleifermann@communicode.de
 * @since 0.15.0
 */
@inject(EVENT_STORE) @observer
class LiveFeedWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const getEventIcon = (type) => {
      switch (type) {
      case "category-update": {
        return <Icon type="folder" style={{fontSize: "20px"}}/>;
      }
      case "category-delete": {
        return <Icon type="folder" style={{fontSize: "20px", color: "red"}}/>;
      }
      }
    };

    return (
      <Col span={8} className="widget-livefeed">
        <Card>
          <Timeline>
            {
              this.props.eventStore.events.reverse().map((event, id) => {
                return (
                  <Timeline.Item dot={getEventIcon(event.type)} key={id}>
                    <Link to={"asd"}>
                      {event.name} was edited by {event.responsible}.
                    </Link>
                  </Timeline.Item>
                );
              })
            }
          </Timeline>
        </Card>
      </Col>
    );
  }
}

LiveFeedWidget.propTypes = {
  /**
   * The event store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  eventStore: MobXPropTypes.observableArray
};

export default LiveFeedWidget;
