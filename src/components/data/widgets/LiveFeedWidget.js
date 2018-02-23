import _ from "lodash";
import React from "react";
import {Link} from "react-router-dom";
import {Col, Card, Timeline, Icon, Tooltip} from "antd";
import {EVENT_STORE} from "../../../stores/storeConstants";
import {inject, observer, PropTypes as MobXPropTypes} from "mobx-react";
import {LINK_CATEGORY_BREADCRUMB, LINK_KEY} from "../../../config/constants";
import moment from "moment";
import "antd/lib/col/style/css";
import "antd/lib/card/style/css";
import "antd/lib/timeline/style/css";
import "antd/lib/icon/style/css";
import "antd/lib/tooltip/style/index.less";
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
  abortTimer;
  constructor(props) {
    super(props);
    this.abortTimer = false;
    this.state = {
      /**
       * @type {object} time - The current time updated live
       */
      time: moment().format()
    };
  }

  componentDidMount() {
    this.updateTime();
  }

  componentWillUnmount() {
    this.abortTimer = true;
  }

  updateTime = () => {
    if(this.abortTimer) {
      this.abortTimer = false;
    } else {
      this.setState({
        time: moment().format()
      });
      setTimeout(() => {
        this.updateTime();
      }, 2000);
    }
  };

  render() {
    const {eventStore} = this.props;

    const getEventItem = (event, id) => {
      let timestampDetailed = moment(event.timestamp).format("MMMM Do YYYY, h:mm:ss a");
      let timestampRelative = moment(event.timestamp).startOf("second").from(this.state.time);

      const timestamp = (
        <Tooltip title={timestampDetailed}>
          <div className="relative-timestamp">
            {timestampRelative}
          </div>
        </Tooltip>
      );

      switch (event.type) {
      case "key-create": {
        const shareLink = LINK_KEY + event.id;
        return (
          <Timeline.Item dot={<Icon type="key" style={{fontSize: "20px", color: "green"}}/>} key={id}>
            <Link to={shareLink}>
              Key &#39;{event.name}&#39; has been added by &#39;{event.responsible}&#39;.
            </Link>
            {timestamp}
          </Timeline.Item>
        );
      }
      case "key-update": {
        const shareLink = LINK_KEY + event.id;
        return (
          <Timeline.Item dot={<Icon type="key" style={{fontSize: "20px"}}/>} key={id}>
              <Link to={shareLink}>
                Key &#39;{event.name}&#39; has been edited by &#39;{event.responsible}&#39;.
              </Link>
            {timestamp}
          </Timeline.Item>
        );
      }
      case "key-delete": {
        return (
          <Timeline.Item dot={<Icon type="key" style={{fontSize: "20px", color: "red"}}/>} key={id}>
            Key &#39;{event.name}&#39; has been deleted by &#39;{event.responsible}&#39;.
            {timestamp}
          </Timeline.Item>
        );
      }
      case "category-create": {
        const shareLink = LINK_CATEGORY_BREADCRUMB + event.id;
        return (
          <Timeline.Item dot={<Icon type="folder" style={{fontSize: "20px"}}/>} key={id}>
            <Link to={shareLink}>
              Category &#39;{event.name}&#39; has been created by &#39;{event.responsible}&#39;.
            </Link>
            {timestamp}
          </Timeline.Item>
        );
      }
      case "category-update": {
        const shareLink = LINK_CATEGORY_BREADCRUMB + event.id;
        return (
          <Timeline.Item dot={<Icon type="folder" style={{fontSize: "20px"}}/>} key={id}>
            <Link to={shareLink}>
              Category &#39;{event.name}&#39; has been edited by &#39;{event.responsible}&#39;.
            </Link>
            {timestamp}
          </Timeline.Item>
        );
      }
      case "category-delete": {
        return (
          <Timeline.Item dot={<Icon type="folder" style={{fontSize: "20px", color: "red"}}/>} key={id}>
            Category &#39;{event.name}&#39; has been deleted by &#39;{event.responsible}&#39;.
            {timestamp}
          </Timeline.Item>
        );
      }
      case "user-create": {
        return (
          <Timeline.Item dot={<Icon type="user" style={{fontSize: "20px"}}/>} key={id}>
            User &#39;{event.name}&#39; has been created by &#39;{event.responsible}&#39;.
            {timestamp}
          </Timeline.Item>
        );
      }
      case "user-update": {
        return (
          <Timeline.Item dot={<Icon type="user" style={{fontSize: "20px"}}/>} key={id}>
            User &#39;{event.name}&#39; has been edited by &#39;{event.responsible}&#39;.
            {timestamp}
          </Timeline.Item>
        );
      }
      case "user-delete": {
        return (
          <Timeline.Item dot={<Icon type="user" style={{fontSize: "20px", color: "red"}}/>} key={id}>
            User &#39;{event.name}&#39; has been deleted by &#39;{event.responsible}&#39;.
            {timestamp}
          </Timeline.Item>
        );
      }
      case "usergroup-create": {
        return (
          <Timeline.Item dot={<Icon type="usergroup-add" style={{fontSize: "20px"}}/>} key={id}>
            User group &#39;{event.name}&#39; has been created by &#39;{event.responsible}&#39;.
            {timestamp}
          </Timeline.Item>
        );
      }
      case "usergroup-update": {
        return (
          <Timeline.Item dot={<Icon type="usergroup-add" style={{fontSize: "20px"}}/>} key={id}>
            User group &#39;{event.name}&#39; has been edited by &#39;{event.responsible}&#39;.
            {timestamp}
          </Timeline.Item>
        );
      }
      case "usergroup-delete": {
        return (
          <Timeline.Item dot={<Icon type="usergroup-delete" style={{fontSize: "20px", color: "red"}}/>} key={id}>
            User group &#39;{event.name}&#39; has been deleted by &#39;{event.responsible}&#39;.
            {timestamp}
          </Timeline.Item>
        );
      }
      case "tag-create": {
        return (
          <Timeline.Item dot={<Icon type="tag" style={{fontSize: "20px"}}/>} key={id}>
            Tag &#39;{event.name}&#39; has been created by &#39;{event.responsible}&#39;.
            {timestamp}
          </Timeline.Item>
        );
      }
      case "tag-update": {
        return (
          <Timeline.Item dot={<Icon type="tag-o" style={{fontSize: "20px"}}/>} key={id}>
            Tag &#39;{event.name}&#39; has been edited by &#39;{event.responsible}&#39;.
            {timestamp}
          </Timeline.Item>
        );
      }
      case "tag-delete": {
        return (
          <Timeline.Item dot={<Icon type="tag" style={{fontSize: "20px", color: "red"}}/>} key={id}>
            Tag &#39;{event.name}&#39; has been deleted by &#39;{event.responsible}&#39;.
            {timestamp}
          </Timeline.Item>
        );
      }
      }
    };

    if(_.isEmpty(eventStore.events)) {
      return (
        <Col span={8} className="widget-livefeed">
          <Card>
            <div className="header">
              Live updates:
            </div>
            <div className="emptymessage">
              <Icon type="ellipsis" />
              There doesn&#39;t seem to be anything in here.
            </div>
          </Card>
        </Col>
      );
    } else {
      return (
        <Col span={8} className="widget-livefeed">
          <Card>
            <div className="header">
              Live updates:
            </div>
            <Timeline>
              {
                eventStore.events.reverse().map((event, id) => {
                  return getEventItem(event, id);
                })
              }
            </Timeline>
          </Card>
        </Col>
      );
    }
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
