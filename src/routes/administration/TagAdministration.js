import React from "react";
import update from "immutability-helper";
import _ from "lodash";
import {Button, Col, Icon, Row, Table} from "antd";
import {inject, observer, PropTypes as MobXPropTypes} from "mobx-react";
import {toJS} from "mobx";
import TagModal from "./../../components/data/TagModal";
import NoDataMessageBox from "./../../components/feedback/NoDataMessageBox";
import {screenMD} from "./../../config/theme/sizes";
import {AUTH_STORE, TAG_STORE} from "./../../stores/storeConstants";
import "antd/lib/button/style/index.less";
import "antd/lib/col/style/css";
import "antd/lib/icon/style/css";
import "antd/lib/row/style/css";
import "antd/lib/table/style/index.less";
import "./TagAdministration.less";
import "./../../BaseLayout.less";

/**
 * The default tag table column configuration.
 */
export const TAG_TABLE_DEFAULT_COLUMNS = [
  {title: "Name", dataIndex: "name", key: "name", fixed: true},
  {title: "Color", dataIndex: "color", key: "color"}
];

/**
 * The administration for tags.
 *
 * @author dvonderbey@communicode.de
 * @since 0.18.0
 */
@inject(AUTH_STORE, TAG_STORE) @observer
class TagAdministration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: {},
      processing: false,
      tagModalCreationMode: false,
      tagModalLocked: true,
      tagModalVisible: false
    };
  }


  /**
   * Handles the tag modal close event.
   *
   * @callback handleTagModalClose
   */
  handleTagModalClose = () => {
    this.toggleTagModal();
    this.setTagModalLockStatus(true);
    this.resetTagObject();
  };

  /**
   * Handles the tag modal creation event.
   *
   * @callback handleTagModalCreation
   */
  handleTagModalCreation = () => {
    this.resetTagObject();
    this.setTagModalCreationMode(true);
    this.toggleTagModal();
  };

  /**
   * Handles the tag modal deletion event.
   *
   * @callback handleTagModalDelete
   */
  handleTagModalDelete = () => {
    this.setProcessingStatus(true);
    this.props.tagStore.deleteOne(this.state.tag.id)
      .then(() => {
        this.setProcessingStatus(false);
        this.handleTagModalClose();
      });
  };

  /**
   * Handles the tag modal save event.
   *
   * @param {object} payload - The key payload
   * @callback handleTagModalSave
   */
  handleTagModalSave = (payload) => {
    this.setProcessingStatus(true);
    const {tag, tagModalCreationMode} = this.state;
    const updatedTag = update(tag, {$merge: payload});
    this.setState({tag: updatedTag});
    tagModalCreationMode
      ?
      this.props.tagStore.create(updatedTag.name, updatedTag.color)
        .then(() => {
          this.setProcessingStatus(false);
          this.handleTagModalClose();
        })
        .catch(error => {
          console.error(error);
          this.setProcessingStatus(false);
        })
      :
      this.props.tagStore.update(updatedTag.id, updatedTag)
        .then(() => {
          this.setProcessingStatus(false);
          this.handleTagModalClose();
        })
        .catch(error => {
          console.error(error);
          this.setProcessingStatus(false);
        });

  };

  /**
   * Handles a tag table record selection event.
   *
   * @callback handleTagTableRecordSelect
   * @param {object} record - The selected tag table record
   */
  handleTagTableRecordSelect = (record) =>
    this.setState({tag: _.find(this.props.tagStore.tags, tag => tag.id === record.id)});

  /**
   * Resets the tag state object.
   */
  resetTagObject = () => this.setState({tag: {}});

  /**
   * Sets the processing status.
   *
   * @param {boolean} status - The new processing status value
   */
  setProcessingStatus = (status) => this.setState({processing: status});

  /**
   * Sets the tag modal mode status.
   *
   * @param {boolean} status - The new tag modal mode status value
   */
  setTagModalCreationMode = (status) => this.setState({tagModalCreationMode: status});

  /**
   * Sets the tag modal lock status.
   *
   * @param {boolean} status - The new tag modal lock status value
   */
  setTagModalLockStatus = (status) => this.setState({tagModalLocked: status});

  /**
   * Toggles the tag modal.
   */
  toggleTagModal = () => this.setState(prevState => ({tagModalVisible: !prevState.tagModalVisible}));

  /**
   * Toggles the tag modal lock status.
   */
  toggleTagModalLockStatus = () => {
    this.setState(prevState => ({tagModalLocked: !prevState.tagModalLocked}));
  };


  render() {
    const {processing, tag, tagModalCreationMode, tagModalLocked, tagModalVisible} = this.state;
    const {authStore, tagStore} = this.props;

    const mainDataView = () => (
      <div>
        <div className="header">
          <Row>
            <Col span={24}>
              <div className="action-button-bar">
                <Button.Group>
                  <Button type="primary" ghost={true} icon="plus" onClick={this.handleTagModalCreation}>Tag</Button>
                </Button.Group>
              </div>
            </Col>
          </Row>
        </div>
        <Row>
          <Table
            dataSource={toJS(tagStore.tags)}
            columns={TAG_TABLE_DEFAULT_COLUMNS}
            rowKey={record => record.id}
            onRowClick={(record) => this.handleTagTableRecordSelect(record)}
            onRowDoubleClick={this.toggleTagModal}
            scroll={{x: screenMD}}
          />
        </Row>
      </div>
    );

    const tagModal = () => (
      <TagModal
        visible={tagModalVisible}
        key={tag.id}
        tag={tag}
        administrationMode={authStore.privileged}
        locked={tagModalLocked}
        creationMode={tagModalCreationMode}
        loading={processing}
        afterClose={() => this.setTagModalCreationMode(false)}
        onClose={this.handleTagModalClose}
        onDelete={this.handleTagModalDelete}
        onSave={this.handleTagModalSave}
        toggleLockStatus={this.toggleTagModalLockStatus}
      />
    );

    const noDataMessageBox = () => (
      <Row type="flex" justify="center">
        <NoDataMessageBox
          callToActionButtonVisible={true}
          onCallToActionButtonClick={this.handleTagModalCreation}
          icon={<Icon type="tags-o"/>}
          headlineText="There are no tags yet."
          subHeadlineText="You can create one by clicking on the button below."
        />
      </Row>
    );

    return (
      <div id="cckey-routes-administration-tag" className="cckey-base-layout-content-container">
        <div className="cckey-base-layout-content-container-inner">
          {tagStore.tags.length ? mainDataView() : noDataMessageBox()}
          {tagModal()}
        </div>
      </div>
    );
  }
}

export default TagAdministration;

TagAdministration.propTypes = {
  /**
   * The authentication store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  authStore: MobXPropTypes.observableArray,

  /**
   * The tag store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  tagStore: MobXPropTypes.observableArray
};
