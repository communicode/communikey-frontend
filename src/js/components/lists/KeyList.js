import React from "react";
import PropTypes from "prop-types";
import {observer, inject} from "mobx-react";
import AdminRoute from "./../AdminRoute";
import KeyCard from "./../KeyCard"

/**
 * A observer list of {@link KeyCard}s.
 *
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
@inject("keyStore") @observer
class KeyList extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      keyDetailModalIsOpen: false,
      passedKey: null
    };
  }

  componentDidMount() {
    this.props.keyStore.fetchKeys();
  }

  handleCategoryAddClick = (passedKey) => {
    this.props.onAddKeyToCategory(passedKey);
  };

  render() {
    const keyList = this.props.keyStore.keys.map(key => {
      return (
        <KeyCard key={key.id} passedKey={key} onCategoryAddClick={this.handleCategoryAddClick}/>
      )
    });

    return (
      <div>
        {keyList}
      </div>
    )
  }
}

KeyList.propTypes = {
  /**
   * @type {toggleCategorySelectionModal} The callback function to handle the event to add a key to a category
   */
  onAddKeyToCategory: PropTypes.func.isRequired
};

export default KeyList;

