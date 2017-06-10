import React from "react";
import update from "immutability-helper";
import {Button, Col, Icon, Row} from "antd";
import {inject, observer, PropTypes as MobXPropTypes} from "mobx-react";
import {toJS} from "mobx";
import KeyModal from "./../../components/data/KeyModal";
import KeyTable from "../../components/data/views/KeyTable";
import NoDataMessageBox from "../../components/feedback/NoDataMessageBox";
import {CATEGORY_STORE, KEY_STORE} from "./../../stores/storeConstants";
import "antd/lib/button/style/index.less";
import "antd/lib/col/style/css";
import "antd/lib/icon/style/css";
import "antd/lib/row/style/css";
import "./KeyAdministration.less";
import "./../../BaseLayout.less";

/**
 * The administration for keys.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.8.0
 */
@inject(CATEGORY_STORE, KEY_STORE) @observer
class KeyAdministration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: {},
      keyModalVisible: false,
      keyModalCreationMode: false,
      keyModalLocked: true,
      processing: false
    };
  }

  /**
   * Handles all key modal input value change events.
   *
   * @callback handleKeyModalValueChange
   * @param event - The change event
   */
  handleKeyModalValueChange = (event) => this.setState({key: update(this.state.key, {[event.target.name]: {$set: event.target.value}})});

  /**
   * Handles the key modal close event.
   *
   * @callback handleKeyModalClose
   */
  handleKeyModalClose = () => {
    this.toggleKeyModal();
    this.setKeyModalLockStatus(true);
    this.resetKeyObject();
  };

  /**
   * Handles the key modal creation event.
   *
   * @callback handleKeyModalCreation
   */
  handleKeyModalCreation = () => {
    this.setKeyModalCreationMode(true);
    this.toggleKeyModal();
  };

  /**
   * Handles the key modal event to add a key to a category.
   *
   * @callback handleKeyModalDelete
   */
  handleKeyModalAddKeyToCategory = (category) => {
    this.setProcessingStatus(true);
    return this.props.categoryStore.addKey(category.id, this.state.key.id)
      .then(() => {
        this.setState({key: this.props.keyStore.findOneById(this.state.key.id)});
        this.setProcessingStatus(false);
      })
      .catch(error => {
        this.setProcessingStatus(false);
        return Promise.reject(error);
      });
  };

  /**
   * Handles the key modal deletion event.
   *
   * @callback handleKeyModalDelete
   */
  handleKeyModalDelete = () => {
    this.setProcessingStatus(true);
    this.props.keyStore.delete(this.state.key.id)
      .then(() => {
        this.setProcessingStatus(false);
        this.handleKeyModalClose();
      });
  };

  /**
   * Handles the key modal save event.
   *
   * @callback handleKeyModalSave
   */
  handleKeyModalSave = () => {
    const {key, keyModalCreationMode} = this.state;
    this.setProcessingStatus(true);
    keyModalCreationMode
      ?
      this.props.keyStore.create(key.name, key.login, key.password)
        .then(() => {
          this.setProcessingStatus(false);
          this.handleKeyModalClose();
        })
        .catch(error => {
          console.error(error);
          this.setProcessingStatus(false);
        })
      :
      this.props.keyStore.update(key.id, key.name, key.login, key.password)
        .then(() => {
          this.setProcessingStatus(false);
          this.handleKeyModalClose();
        })
        .catch(error => {
          console.error(error);
          this.setProcessingStatus(false);
        });
  };

  /**
   * Handles a key table record selection event.
   *
   * @callback handleKeyTableRecordSelect
   * @param {object} record - The selected key table record
   */
  handleKeyTableRecordSelect = (record) =>
    this.setState({key: this.props.keyStore.keys[this.props.keyStore.keys.findIndex(key => key.id === record.id)]});

  /**
   * Resets the state key object.
   */
  resetKeyObject = () => this.setState({key: {}});

  /**
   * Sets the processing status.
   *
   * @param {boolean} status - The new processing status value
   */
  setProcessingStatus = (status) => this.setState({processing: status});

  /**
   * Sets the key modal mode status.
   *
   * @param {boolean} status - The new key modal mode status value
   */
  setKeyModalCreationMode = (status) => this.setState({keyModalCreationMode: status});

  /**
   * Sets the key modal lock status.
   *
   * @param {boolean} status - The new key modal lock status value
   */
  setKeyModalLockStatus = (status) => this.setState({keyModalLocked: status});

  /**
   * Toggles the key modal.
   */
  toggleKeyModal = () => this.setState(prevState => ({keyModalVisible: !prevState.keyModalVisible}));

  /**
   * Toggles the key modal lock status.
   */
  toggleKeyModalLockStatus = () => {
    this.setState(prevState => ({keyModalLocked: !prevState.keyModalLocked}));
  };

  render() {
    const {key, keyModalVisible, keyModalCreationMode, keyModalLocked, processing} = this.state;
    const {categoryStore, keyStore} = this.props;

    const mainDataView = () => (
      <div>
        <div className="header">
          <Row>
            <Col span={4} offset={20}>
              <div className="operations">
                <Button.Group>
                  <Button type="primary" ghost={true} icon="plus" onClick={this.handleKeyModalCreation}/>
                </Button.Group>
              </div>
            </Col>
          </Row>
        </div>
        <Row>
          <KeyTable
            dataSource={toJS(keyStore.keys)}
            onRowClick={(record) => this.handleKeyTableRecordSelect(record)}
            onRowDoubleClick={this.toggleKeyModal}
          />
        </Row>
      </div>
    );

    const keyModal = () => (
      <KeyModal
        visible={keyModalVisible}
        key={key.id}
        cckeyKey={key}
        categories={categoryStore.categories}
        administrationMode={true}
        locked={keyModalLocked}
        creationMode={keyModalCreationMode}
        loading={processing}
        afterClose={() => this.setKeyModalCreationMode(false)}
        onCategoryTreeSelectionSave={this.handleKeyModalAddKeyToCategory}
        onClose={this.handleKeyModalClose}
        onDelete={this.handleKeyModalDelete}
        onSave={this.handleKeyModalSave}
        onValueChange={this.handleKeyModalValueChange}
        toggleLockStatus={this.toggleKeyModalLockStatus}
      />
    );

    const noDataMessageBox = () => (
      <Row type="flex" justify="center">
        <NoDataMessageBox
          onCallToActionButtonClick={this.handleKeyModalCreation}
          icon={<Icon type="key"/>}
          headlineText="There are no keys yet."
          subHeadlineText="You can create one by clicking on the button below."
        />
      </Row>
    );

    return (
      <div className="cckey-base-layout-content-container">
        <div className="cckey-base-layout-content-container-inner">
          {keyStore.keys.length ? mainDataView() : noDataMessageBox()}
          {keyModal()}
        </div>
      </div>
    );
  }
}

export default KeyAdministration;

KeyAdministration.propTypes = {
  /**
   * The category store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  categoryStore: MobXPropTypes.observableArray,

  /**
   * The key store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  keyStore: MobXPropTypes.observableArray
};
