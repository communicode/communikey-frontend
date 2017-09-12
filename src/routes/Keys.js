import React from "react";
import {toJS} from "mobx";
import {inject, observer, PropTypes as MobXPropTypes} from "mobx-react";
import PropTypes from "prop-types";
import _ from "lodash";
import update from "immutability-helper";
import {Button, Col, Icon, Row, Tabs, Table, Tooltip, Breadcrumb} from "antd";
import CategoryModal from "./../components/data/CategoryModal";
import CategoryTree from "./../components/data/views/CategoryTree";
import KeyModal from "./../components/data/KeyModal";
import NoDataMessageBox from "./../components/feedback/NoDataMessageBox";
import {getAncestors} from "../services/StoreService";
import {notificationService} from "../Communikey";
import {AUTH_STORE, CATEGORY_STORE, KEY_STORE, USER_GROUP_STORE} from "./../stores/storeConstants";
import {
  TAB_PANE_REACT_KEY_CATEGORIZED,
  TAB_PANE_REACT_KEY_POOL,
  LINK_CATEGORY_BREADCRUMB
} from "../config/constants";
import {ROUTE_KEYS} from "../routes/routeMappings";
import {Link} from "react-router-dom";
import {screenMD} from "./../config/theme/sizes";
import "antd/lib/button/style/index.less";
import "antd/lib/col/style/css";
import "antd/lib/icon/style/css";
import "antd/lib/pagination/style/index.less";
import "antd/lib/row/style/css";
import "antd/lib/tabs/style/index.less";
import "antd/lib/table/style/index.less";
import "antd/lib/tooltip/style/index.less";
import "antd/lib/breadcrumb/style/index.less";
import "./Keys.less";
import "./../BaseLayout.less";

/**
 * The default key table column configuration.
 */
const KEY_TABLE_DEFAULT_COLUMNS = [
  {title: "Name", dataIndex: "name", key: "name", fixed: true, width: 400},
  {title: "Login", dataIndex: "login", key: "login"}
];

/**
 * The main key route.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @author lleifermann@communicode.de
 * @since 0.5.0
 */
@inject(AUTH_STORE, CATEGORY_STORE, KEY_STORE,USER_GROUP_STORE) @observer
class Keys extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: {},
      categoryModalCreationMode: false,
      categoryModalLocked: true,
      categoryModalVisible: false,
      categoryTreeDraggable: false,
      categoryTreeExpandedNodeKeys: [],
      categoryTreeAutoExpandParent: false,
      categoryTreeSelectedNode: null,
      categoryTreeSelectedNodeKeys: [],
      key: {},
      keyModalCreationMode: false,
      keyModalLocked: true,
      keyModalVisible: false,
      processing: false,
      activeTab: TAB_PANE_REACT_KEY_CATEGORIZED
    };
  }

  componentDidMount() {
    this.setState({processing: true});
    this.props.categoryStore.fetchAll()
      .then(() => this.setState({processing: false}))
      .catch(() => this.setState({processing: false}));
    if(this.props.cckey) {
      this.setState({
        activeTab: TAB_PANE_REACT_KEY_POOL,
        key: this.props.cckey,
        keyModalVisible: true
      });
    }
    if(this.props.category) {
      let parents = [];
      const findParents = (category) => {
        parents.push(category.id);
        category.parent && findParents(this.props.categoryStore._findById(category.parent));
      };
      this.props.category.parent && findParents(this.props.categoryStore._findById(this.props.category.parent));
      this.setState({
        category: this.props.category,
        categoryTreeExpandedNodeKeys: parents
      });
    }
  }

  /**
   * Handles the category modal close event.
   *
   * @callback handleCategoryModalClose
   */
  handleCategoryModalClose = () => {
    this.toggleCategoryModal();
    this.setCategoryModalLockStatus(true);
    this.resetSelectedNodeKeys();
  };

  /**
   * Handles the category modal creation event.
   *
   * @callback handleCategoryModalCreation
   */
  handleCategoryModalCreation = () => {
    this.resetSelectedCategoryObject();
    this.setCategoryModalCreationMode(true);
    this.toggleCategoryModal();
  };

  /**
   * Handles the category modal deletion event.
   *
   * @callback handleCategoryModalDelete
   */
  handleCategoryModalDelete = () => {
    this.setProcessingStatus(true);
    this.props.categoryStore.deleteOne(this.state.category.id)
      .then(() => {
        this.setProcessingStatus(false);
        this.handleCategoryModalClose();
        this.resetSelectedCategoryObject();
      });
  };

  /**
   * Handles the category modal save event.
   *
   * @param {object} payload - The key payload
   * @callback handleCategoryModalSave
   */
  handleCategoryModalSave = (payload) => {
    this.setProcessingStatus(true);
    const {category, categoryModalCreationMode} = this.state;
    const updatedCategory = update(category, {$merge: payload});
    this.setState({category: updatedCategory});
    categoryModalCreationMode
      ?
      this.props.categoryStore.create(updatedCategory.name)
        .then(() => {
          this.setProcessingStatus(false);
          this.handleCategoryModalClose();
        })
        .catch(() => this.setProcessingStatus(false))
      :
      this.props.categoryStore.update(updatedCategory)
        .then(() => {
          this.setProcessingStatus(false);
          this.handleCategoryModalClose();
          this.resetSelectedCategoryObject();
        })
        .catch(() => this.setProcessingStatus(false));
  };

  /**
   * Handles the category tree drop event.
   *
   * @callback handleCategoryTreeOnDrop
   * @param event - The drop event
   */
  handleCategoryTreeOnDrop = (event) => {
    if (event.dragNode && !event.dropToGap) {
      this.setState({processing: true});
      this.props.categoryStore.addChild(event.node.props.category.id, event.dragNode.props.category.id)
        .then(() => this.setState({processing: false}))
        .catch(() => this.setState({processing: false}));
    }
  };

  /**
   * Handles the category tree expand event.
   *
   * @callback handleCategoryTreeOnExpand
   * @param expandedKeys - The expanded keys
   */
  handleCategoryTreeOnExpand = (expandedKeys) => this.setState({categoryTreeExpandedNodeKeys: expandedKeys});

  /**
   * Handles the category tree selection event.
   *
   * @callback handleCategoryTreeOnSelection
   * @param selectedNodeKeys - The selected keys
   * @param selectedTreeNode - The selected tree node
   */
  handleCategoryTreeOnSelection = (selectedNodeKeys, selectedTreeNode) => {
    this.resetSelectedCategoryObject();
    this.resetSelectedNodeKeys();
    if (selectedTreeNode.selected) {
      this.setState({
        category: selectedTreeNode.node.props.category,
        categoryTreeSelectedNode: selectedTreeNode,
        categoryTreeSelectedNodeKeys: selectedNodeKeys
      });
    }
  };

  /**
   * Handles the event to add a user group to the category.
   *
   * @callback handleCategoryModalOnUserGroupAdd
   * @param {object} userGroup - The user group to add to the category
   * @since 0.10.0
   */
  handleCategoryModalOnUserGroupAdd = (userGroup) => {
    this.setProcessingStatus(true);
    this.props.categoryStore.addUserGroup(this.state.category.id, userGroup.id)
      .then(updatedCategory => {
        this.setState({category: update(this.state.category, {$merge: updatedCategory})});
        this.setProcessingStatus(false);
      })
      .catch(() => this.setProcessingStatus(false));
  };

  /**
   * Handles the event to remove a user group from the category.
   *
   * @callback handleCategoryModalOnUserGroupRemove
   * @param {object} userGroup - The user group to remove from the category
   * @since 0.10.0
   */
  handleCategoryModalOnUserGroupRemove = (userGroup) => {
    this.setProcessingStatus(true);
    this.props.categoryStore.removeUserGroup(this.state.category.id, userGroup.id)
      .then(updatedCategory => {
        this.setState({category: update(this.state.category, {$merge: updatedCategory})});
        this.setProcessingStatus(false);
      })
      .catch(() => this.setProcessingStatus(false));
  };

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
    this.resetKeyObject();
    this.setKeyModalCreationMode(true);
    this.toggleKeyModal();
  };

  /**password
   * Handles the key modal event to add a key to a category.
   *
   * @callback handleKeyModalDelete
   */
  handleKeyModalAddKeyToCategory = (category) => {
    this.setProcessingStatus(true);
    return this.props.categoryStore.addKey(category.id, this.state.key.id)
      .then(() => {
        this.setState({key: this.props.keyStore._findOneById(this.state.key.id)});
        this.setProcessingStatus(false);
      })
      .catch(error => {
        this.setProcessingStatus(false);
        return Promise.reject(error);
      });
  };

  /**
   * Handles all key modal category tree select value change events.
   *
   * @callback handleKeyModalCategoryTreeSelectValueChange
   * @param label - The label of the selected tree node
   * @param selectValue - The value of the selection
   * @param selectedTreeNode - The selected tree node
   */
  handleKeyModalCategoryTreeSelectValueChange = (label, selectValue, selectedTreeNode) => {
    selectedTreeNode.triggerNode && this.setState({
      key: update(this.state.key, {categoryId: {$set: selectedTreeNode.triggerNode.props.category.id}})
    });
  };

  /**
   * Handles the key modal deletion event.
   *
   * @callback handleKeyModalDelete
   */
  handleKeyModalDelete = () => {
    this.setProcessingStatus(true);
    this.props.keyStore.deleteOne(this.state.key.id)
      .then(() => {
        this.setProcessingStatus(false);
        this.handleKeyModalClose();
      });
  };

  /**
   * Handles the key modal save event.
   *
   * @param {object} payload - The key payload
   * @callback handleKeyModalSave
   */
  handleKeyModalSave = (payload) => {
    this.setProcessingStatus(true);
    const {key, keyModalCreationMode} = this.state;
    const updatedKey = update(key, {$merge: payload});
    this.setState({key: updatedKey});
    if(keyModalCreationMode) {
      return this.props.keyStore.create(updatedKey.categoryId,
                                        updatedKey.name,
                                        payload.password,
                                        updatedKey.login,
                                        updatedKey.notes)
        .then(() => {
          this.setProcessingStatus(false);
          this.handleKeyModalClose();
        })
        .catch(() => {
          this.setProcessingStatus(false);
          notificationService.error("Error creating key", "Your private key has to be decrypted to create this key.", 5);
        });
    } else {
      return this.props.keyStore.update(updatedKey.id,
                                        updatedKey.name,
                                        payload.password,
                                        updatedKey.login,
                                        updatedKey.notes)
        .then(() => {
          console.log("here 1");
          this.setProcessingStatus(false);
          this.handleKeyModalClose();
        })
        .catch(() => {
          console.log("here 2");
          this.setProcessingStatus(false);
          notificationService.error("Error updating key", "Your private key has to be decrypted to update this key.", 5);
        });
    }
  };

  /**
   * Handles a key table record selection event.
   *
   * @callback handleKeyTableRecordSelect
   * @param {object} record - The selected key table record
   */
  handleKeyTableRecordSelect = (record) => this.setState({key: _.find(this.props.keyStore.keys, key => key.id === record.id)});

  /**
   * Resets the state key object.
   */
  resetKeyObject = () => this.setState({key: {}});

  /**
   * Resets the state selected category object.
   */
  resetSelectedCategoryObject = () => this.setState({category: {}});

  /**
   * Resets the state selected category object.
   */
  resetSelectedNodeKeys = () => this.setState({categoryTreeSelectedNodeKeys: []});

  /**
   * Sets the category modal mode status.
   *
   * @param {boolean} status - The new category modal mode status value
   */
  setCategoryModalCreationMode = (status) => this.setState({categoryModalCreationMode: status});

  /**
   * Sets the category modal lock status.
   *
   * @param {boolean} status - The new category modal lock status value
   */
  setCategoryModalLockStatus = (status) => this.setState({categoryModalLocked: status});

  /**
   * Sets the key modal mode status.
   *
   * @param {boolean} status - The new key modal mode status value
   */
  setKeyModalCreationMode = (status) => this.setState({keyModalCreationMode: status});

  /**
   * Sets the category modal lock status.
   *
   * @param {boolean} status - The new category modal lock status value
   */
  setKeyModalLockStatus = (status) => this.setState({keyModalLocked: status});

  /**
   * Sets the processing status.
   *
   * @param {boolean} status - The new processing status value
   */
  setProcessingStatus = (status) => this.setState({processing: status});

  /**
   * Toggles the category modal.
   */
  toggleCategoryModal = () => this.setState(prevState => ({categoryModalVisible: !prevState.categoryModalVisible}));

  /**
   * Toggles the category modal lock status.
   */
  toggleCategoryModalLockStatus = () => {
    this.setState(prevState => ({categoryModalLocked: !prevState.categoryModalLocked}));
  };

  /**
   * Toggles the category tree drag status.
   */
  toggleCategoryTreeDragStatus = () => {
    this.setState(prevState => ({categoryTreeDraggable: !prevState.categoryTreeDraggable}));
  };

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
    const {authStore, categoryStore, keyStore, userGroupStore} = this.props;
    const {
      category,
      categoryModalCreationMode,
      categoryModalLocked,
      categoryModalVisible,
      categoryTreeDraggable,
      categoryTreeExpandedNodeKeys,
      categoryTreeAutoExpandParent,
      categoryTreeSelectedNodeKeys,
      key,
      keyModalVisible,
      keyModalCreationMode,
      keyModalLocked,
      processing
    } = this.state;

    const dragStatusButton = () => (
      <Button key="categoryTreeDragStatus" type={categoryTreeDraggable ? "dashed" : "ghost"} onClick={this.toggleCategoryTreeDragStatus} icon="swap">
        {categoryTreeDraggable ? "Disable dragging" : "Enable dragging"}
      </Button>
    );

    const selectedCategory = () => (
      <div>
        {this.state.category.name}
        {
        authStore.privileged &&
        <Tooltip title="Edit category">
          <Button shape="circle" onClick={this.toggleCategoryModal}>
            <Icon type="edit"/>
          </Button>
        </Tooltip>
        }
      </div>
    );

    const tabViewCategorized = () => (
      <Tabs.TabPane tab="Categorized" key={TAB_PANE_REACT_KEY_CATEGORIZED}>
        {categoryStore.categories.length ? tabViewCategorizedOperationHeaderSection() : null}
        <Row>
          {categoryStore.categories.length
            ?
            <div>
              <Col span={6}>
                <CategoryTree
                  autoExpandParent={categoryTreeAutoExpandParent}
                  draggable={categoryTreeDraggable}
                  expandedKeys={categoryTreeExpandedNodeKeys}
                  categories={categoryStore.categories}
                  onDrop={this.handleCategoryTreeOnDrop}
                  onExpand={this.handleCategoryTreeOnExpand}
                  onSelect={this.handleCategoryTreeOnSelection}
                  selectedKeys={categoryTreeSelectedNodeKeys}
                  processing={processing}
                  className="category-tree"
                />
              </Col>
              <Col span={18}>{tabViewCategorizedKeyTable()}</Col></div>
            :
            <Col span={24}>{tabViewCategorizedNoDataMessageBox()}</Col>
          }
        </Row>
      </Tabs.TabPane>
    );

    const tabViewPool = () => (
      <Tabs.TabPane tab="Key Pool" key={TAB_PANE_REACT_KEY_POOL}>
        <Row>
          <Col span={24}>
            {keyStore.keys.length
              ?
              tabViewPoolKeyTable()
              :
              tabViewPoolNoDataMessageBox()
            }
          </Col>
        </Row>
      </Tabs.TabPane>
    );

    const tabViewCategorizedOperationHeaderSection = () => (
      <div className="tab-view-categorized-operation-header-section">
        <Row>
          <Col span={16}>
            <div className="category-breadcrumbs">
              <Breadcrumb separator="/">
                <Breadcrumb.Item>
                  <Link to={ROUTE_KEYS}>
                    <Icon type="home"/>
                  </Link>
                </Breadcrumb.Item>
                {getAncestors(this.props.categoryStore.categories, this.state.category, "parent", true, true).map(function(object, id) {
                  const shareLink = LINK_CATEGORY_BREADCRUMB + object.id;
                  return (
                    <Breadcrumb.Item key={id}>
                      <Link to={shareLink}>
                        {object.name}
                      </Link>
                    </Breadcrumb.Item>
                  );
                })}
                <Breadcrumb.Item>
                  &nbsp;
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <div className="header-category-name">
              {this.state.category.name
                ? selectedCategory()
                : "No category selected"
              }
            </div>
          </Col>
          <Col span={8}>
            {authStore.privileged &&
            <div className="action-button-bar">
              {/*<Button.Group>*/}
                {/*<Button type="primary" ghost={true} icon="edit" onClick={this.toggleCategoryModal} disabled={!categoryTreeSelectedNodeKeys.length}>*/}
                  {/*Edit*/}
                {/*</Button>*/}
              {/*</Button.Group>*/}
              <Button.Group>
                {dragStatusButton()}
              </Button.Group>
            </div>
            }
          </Col>
        </Row>
      </div>
    );

    const tabViewCategorizedKeyTable = () => (
      <Table
        dataSource={keyStore._filterAllByCategory(category.id)}
        columns={KEY_TABLE_DEFAULT_COLUMNS}
        rowKey={record => record.id}
        onRowClick={(record) => this.handleKeyTableRecordSelect(record)}
        onRowDoubleClick={this.toggleKeyModal}
        scroll={{x: screenMD}}
      />
    );

    const tabViewPoolKeyTable = () => (
      <Table
        dataSource={toJS(keyStore.keys)}
        columns={KEY_TABLE_DEFAULT_COLUMNS}
        rowKey={record => record.id}
        onRowClick={(record) => this.handleKeyTableRecordSelect(record)}
        onRowDoubleClick={this.toggleKeyModal}
        scroll={{x: screenMD}}
      />
    );

    const categoryModal = () => (
      <CategoryModal
        visible={categoryModalVisible}
        key={"categoryModal" + key.id}
        category={category}
        userGroups={toJS(userGroupStore.userGroups)}
        administrationMode={authStore.privileged}
        locked={categoryModalLocked}
        creationMode={categoryModalCreationMode}
        loading={processing}
        afterClose={() => this.setCategoryModalCreationMode(false)}
        onClose={this.handleCategoryModalClose}
        onDelete={this.handleCategoryModalDelete}
        onSave={this.handleCategoryModalSave}
        onUserGroupAdd={this.handleCategoryModalOnUserGroupAdd}
        onUserGroupRemove={this.handleCategoryModalOnUserGroupRemove}
        toggleLockStatus={this.toggleCategoryModalLockStatus}
      />
    );

    const keyModal = () => (
      <KeyModal
        visible={keyModalVisible}
        key={"keyModal" + key.id}
        cckeyKey={key}
        categories={categoryStore.categories}
        administrationMode={authStore.privileged}
        locked={keyModalLocked}
        creationMode={keyModalCreationMode}
        loading={processing}
        afterClose={() => this.setKeyModalCreationMode(false)}
        onCategoryTreeSelectionSave={this.handleKeyModalAddKeyToCategory}
        onCategoryTreeSelectValueChange={this.handleKeyModalCategoryTreeSelectValueChange}
        onClose={this.handleKeyModalClose}
        onDelete={this.handleKeyModalDelete}
        onSave={this.handleKeyModalSave}
        toggleLockStatus={this.toggleKeyModalLockStatus}
      />
    );

    const tabViewCategorizedNoDataMessageBox = () => (
      <Row type="flex" justify="center">
        <NoDataMessageBox
          callToActionButtonVisible={authStore.privileged}
          onCallToActionButtonClick={this.handleCategoryModalCreation}
          icon={<Icon type="folder"/>}
          headlineText="There are no categories yet."
          subHeadlineText={authStore.privileged ? "You can create one by clicking on the button below." : ""}
        />
      </Row>
    );

    const tabViewPoolNoDataMessageBox = () => (
      <Row type="flex" justify="center">
        <NoDataMessageBox
          callToActionButtonVisible={authStore.privileged}
          onCallToActionButtonClick={this.handleKeyModalCreation}
          icon={<Icon type="key"/>}
          headlineText="There are no keys yet."
          subHeadlineText={authStore.privileged ? "You can create one by clicking on the button below." : ""}
        />
      </Row>
    );

    const tabBarOperations = () => (
      <div className="tab-bar-operations">
        <Button.Group>
          <Button type="primary" ghost={true} onClick={this.handleCategoryModalCreation}>
            <Icon type="plus"/> Category
          </Button>
          <Button type="primary" ghost={true} onClick={this.handleKeyModalCreation}>
            <Icon type="plus"/> Key
          </Button>
        </Button.Group>
      </div>
    );

    const changeTab = (element) => {
      this.setState({activeTab: element});
    };

    return (
      <div id="cckey-routes-keys" className="cckey-base-layout-content-container">
        <div className="cckey-base-layout-content-container-inner">
          <Tabs activeKey={this.state.activeTab} onTabClick={changeTab} tabBarExtraContent={authStore.privileged && tabBarOperations()}>
            {tabViewCategorized()}
            {tabViewPool()}
          </Tabs>
          {categoryModal()}
          {keyModal()}
        </div>
      </div>
    );
  }
}

export default Keys;

Keys.propTypes = {
  /**
   * The authentication store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  authStore: MobXPropTypes.observableArray,

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
  keyStore: MobXPropTypes.observableArray,

  /**
   * The user group store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  userGroupStore: MobXPropTypes.observableArray,

  /**
   * The key id for deep routes
   *
   * @type {integer}
   */
  cckey: PropTypes.object,

  /**
   * The category id for deep routes
   *
   * @type {integer}
   */
  category: PropTypes.object
};
