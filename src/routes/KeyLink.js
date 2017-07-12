import React from "react";
import {KEY_STORE} from "../stores/storeConstants";
import {inject, PropTypes as MobXPropTypes} from "mobx-react";
import {Button, notification} from "antd";
import {PropTypes} from "prop-types";
import Keys from "./Keys";
import _ from "lodash";
import "antd/lib/notification/style/index.css";

/**
 * The wrapper component for deep routed keys.
 *
 * @author dvonderbey@communicode.de
 * @since 0.12.0
 */
@inject(KEY_STORE)
class KeyLink extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // const close = () => {
    //   console.log("Notification was closed. Either the close button was clicked or duration time elapsed.");
    // };
    // const openErrorNotification = () => {
    //   const key = `open${Date.now()}`;
    //   const btnClick = function () {
    //     notification.close(key);
    //   };
    //   const btn = (
    //     <Button type="primary" size="small" onClick={btnClick}>
    //       Confirm
    //     </Button>
    //   );
    //   notification.open({
    //     message: "Key not found!",
    //     description: "The key has not been found. Please check the supplied link.",
    //     btn,
    //     key,
    //     onClose: close
    //   });
    // };
    //
    // notification.config({
    //   placement: "topRight",
    //   bottom: 50,
    //   duration: 0
    // });

    const checkHash = (hash) => _.find(this.props.keyStore.keys, key => key.id == hash);
    let key = checkHash(this.props.match.params.id);
    !key && openErrorNotification();
    return <Keys cckey={this.props.match.params.id && key}/>;
  }
}

export default KeyLink;

KeyLink.propTypes = {
  /**
   * The key store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  keyStore: MobXPropTypes.observableArray,

  /**
   * The match injected from the react router
   *
   * @type {object}
   */
  match: PropTypes.object.isRequired
};