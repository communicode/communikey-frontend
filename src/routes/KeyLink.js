import React from "react";
import {KEY_STORE} from "../stores/storeConstants";
import {inject, PropTypes as MobXPropTypes} from "mobx-react";
import {PropTypes} from "prop-types";
import Keys from "./Keys";
import _ from "lodash";

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
    const checkHash = (hash) => _.find(this.props.keyStore.keys, key => key.id == hash);
    return <Keys cckey={this.props.match.params.id && checkHash(this.props.match.params.id)}/>;
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