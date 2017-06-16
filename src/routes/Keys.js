import React from "react";
import {inject, observer, PropTypes as MobXPropTypes} from "mobx-react";
import {toJS} from "mobx";
import {Col, Icon, Row} from "antd";
import CategoryTree from "./../components/data/views/CategoryTree";
import KeyModal from "./../components/data/KeyModal";
import KeyTable, {KEY_TABLE_DEFAULT_COLUMNS} from "./../components/data/views/KeyTable";
import NoDataMessageBox from "./../components/feedback/NoDataMessageBox";
import {CATEGORY_STORE} from "./../stores/storeConstants";
import "antd/lib/col/style/css";
import "antd/lib/icon/style/css";
import "antd/lib/row/style/css";
import "./Keys.less";
import "./../BaseLayout.less";

/**
 * The main key route.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
@inject(CATEGORY_STORE) @observer
class Keys extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: {},
      categoryTreeExpandedNodeKeys: [],
      categoryTreeAutoExpandParent: false,
      categoryTreeSelectedNode: null,
      categoryTreeSelectedNodeKeys: [],
      key: {},
      keyModalVisible: false
    };
  }

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
    this.setState({
      category: selectedTreeNode.node.props.category,
      categoryTreeSelectedNode: selectedTreeNode,
      categoryTreeSelectedNodeKeys: selectedNodeKeys
    });
  };

  /**
   * Handles the key modal close event.
   *
   * @callback handleKeyModalClose
   */
  handleKeyModalClose = () => {
    this.toggleKeyModal();
    this.resetKeyObject();
  };

  /**
   * Handles a key table record selection event.
   *
   * @callback handleKeyTableRecordSelect
   * @param {object} record - The selected key table record
   */
  handleKeyTableRecordSelect = (record) =>
    this.setState({key: this.state.category.keys[this.state.category.keys.findIndex(key => key.id === record.id)]});

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
   * Toggles the key modal.
   */
  toggleKeyModal = () => this.setState(prevState => ({keyModalVisible: !prevState.keyModalVisible}));

  render() {
    const {categoryStore} = this.props;
    const {
      category,
      categoryTreeExpandedNodeKeys,
      categoryTreeAutoExpandParent,
      categoryTreeSelectedNodeKeys,
      key,
      keyModalVisible
    } = this.state;

    const mainDataView = () => (
      <div>
        <Row type="flex" justify="space-between">
          <Col span={6}>
            <CategoryTree
              autoExpandParent={categoryTreeAutoExpandParent}
              expandedKeys={categoryTreeExpandedNodeKeys}
              categories={categoryStore.categories}
              onExpand={this.handleCategoryTreeOnExpand}
              onSelect={this.handleCategoryTreeOnSelection}
              selectedKeys={categoryTreeSelectedNodeKeys}
              className="category-tree"
            />
          </Col>
          <Col span={18}>{keyTable()}</Col>
        </Row>
      </div>
    );

    const keyTable = () => {
      let columns = KEY_TABLE_DEFAULT_COLUMNS.slice(0);
      columns.splice(columns.findIndex(entry => entry.key === "category.name"), 1);

      return (
        <KeyTable
          dataSource={toJS(category.keys ? category.keys : [])}
          onRowClick={(record) => this.handleKeyTableRecordSelect(record)}
          onRowDoubleClick={this.toggleKeyModal}
          show={category.keys && !!category.keys.length}
          columns={columns}

        />
      );
    };

    const keyModal = () => (
      <KeyModal
        visible={keyModalVisible}
        key={key.id}
        cckeyKey={key}
        categories={categoryStore.categories}
        onClose={this.handleKeyModalClose}
      />
    );

    const noDataMessageBox = () => (
      <Row type="flex" justify="center">
        <NoDataMessageBox
          icon={<Icon type="key"/>}
          headlineText="There are no keys yet."
          callToActionButtonVisible={false}
        />
      </Row>
    );

    return (
      <div className="cckey-base-layout-content-container">
        <div className="cckey-base-layout-content-container-inner">
          {categoryStore.categories.length ? mainDataView() : noDataMessageBox()}
          {keyModal()}
        </div>
      </div>
    );
  }
}

export default Keys;

Keys.propTypes = {
  /**
   * The category store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  categoryStore: MobXPropTypes.observableArray
};
