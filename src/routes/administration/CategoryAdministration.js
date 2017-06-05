import React from "react";
import {inject, observer, PropTypes as MobXPropTypes} from "mobx-react";
import update from "immutability-helper";
import {Button, Col, Row} from "antd";
import CategoryTree from "./../../components/data/views/CategoryTree";
import CategoryModal from "./../../components/data/CategoryModal";
import {CATEGORY_STORE} from "./../../stores/storeConstants";
import "antd/lib/button/style/index.less";
import "antd/lib/col/style/css";
import "antd/lib/row/style/css";
import "./CategoryAdministration.less";
import "./../../BaseLayout.less";

/**
 * The administration for categories.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
@inject(CATEGORY_STORE) @observer
class CategoryAdministration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: {},
      categoryModalCreationMode: false,
      categoryModalLocked: true,
      categoryModalVisible: false,
      categoryTreeExpandedNodeKeys: [],
      categoryTreeAutoExpandParent: false,
      categoryTreeSelectedNode: null,
      categoryTreeSelectedNodeKeys: [],
      processing: false
    };
  }

  /**
   * Handles the category modal close event.
   *
   * @callback handleCategoryModalClose
   */
  handleCategoryModalClose = () => {
    this.toggleCategoryModal();
    this.setCategoryModalLockStatus(true);
    this.resetSelectedCategoryObject();
    this.resetSelectedNodeKeys();
    this.setCategoryModalCreationMode(false);
  };

  /**
   * Handles the category modal creation event.
   *
   * @callback handleCategoryModalCreation
   */
  handleCategoryModalCreation = () => {
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
    this.props.categoryStore.delete(this.state.category.id)
      .then(() => {
        this.setProcessingStatus(false);
        this.handleCategoryModalClose();
      });
  };

  /**
   * Handles the category modal save event.
   *
   * @callback handleCategoryModalSave
   */
  handleCategoryModalSave = () => {
    const {category, categoryModalCreationMode} = this.state;
    this.setProcessingStatus(true);
    categoryModalCreationMode
      ?
      this.props.categoryStore.create(category.name)
        .then(() => {
          this.setProcessingStatus(false);
          this.handleCategoryModalClose();
        })
        .catch(error => {
          console.error(error);
          this.setProcessingStatus(false);
        })
      :
      this.props.categoryStore.update(category)
        .then(() => {
          this.setProcessingStatus(false);
          this.handleCategoryModalClose();
        })
        .catch(error => {
          console.error(error);
          this.setProcessingStatus(false);
        });
  };

  /**
   * Handles all category modal input value change events.
   *
   * @callback handleCategoryModalValueChange
   * @param event - The change event
   */
  handleCategoryModalValueChange = (event) => {
    this.setState({
      category: update(this.state.category, {[event.target.name]: {$set: event.target.value}}),
      categoryModalCategoryModified: true
    });
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
    this.setState({
      category: selectedTreeNode.node.props.category,
      categoryTreeSelectedNode: selectedTreeNode,
      categoryTreeSelectedNodeKeys: selectedNodeKeys
    });
    this.toggleCategoryModal();
  };

  /**
   * Resets the state selected category object.
   */
  resetSelectedCategoryObject = () => this.setState({category: {}});

  /**
   * Resets the state selected category object.
   */
  resetSelectedNodeKeys = () => this.setState({categoryTreeSelectedNodeKeys: []});

  /**
   * Sets the processing status.
   *
   * @param {boolean} status - The new processing status value
   */
  setProcessingStatus = (status) => this.setState({processing: status});

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
   * Toggles the category modal.
   */
  toggleCategoryModal = () => this.setState(prevState => ({categoryModalVisible: !prevState.categoryModalVisible}));

  /**
   * Toggles the category modal lock status.
   */
  toggleCategoryModalLockStatus = () => {
    this.setState(prevState => ({categoryModalLocked: !prevState.categoryModalLocked}));
  };

  render() {
    const {categoryStore} = this.props;
    const {
      category,
      categoryModalCreationMode,
      categoryModalLocked,
      categoryModalVisible,
      categoryTreeExpandedNodeKeys,
      categoryTreeAutoExpandParent,
      categoryTreeSelectedNodeKeys,
      processing
    } = this.state;

    return (
      <div className="cckey-base-layout-content-container">
        <div className="cckey-base-layout-content-container-inner">
          <div className="header">
            <Row>
              <Col span={4} offset={20}>
                <div className="operations">
                  <Button.Group>
                    <Button type="primary" ghost={true} icon="plus" onClick={this.handleCategoryModalCreation}/>
                  </Button.Group>
                </div>
              </Col>
            </Row>
          </div>
          <Row>
            <Col>
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
            <CategoryModal
              visible={categoryModalVisible}
              key={category.id}
              category={category}
              locked={categoryModalLocked}
              creationMode={categoryModalCreationMode}
              loading={processing}
              onClose={this.handleCategoryModalClose}
              onDelete={this.handleCategoryModalDelete}
              onSave={this.handleCategoryModalSave}
              onValueChange={this.handleCategoryModalValueChange}
              toggleLockStatus={this.toggleCategoryModalLockStatus}
            />
          </Row>
        </div>
      </div>
    );
  }
}

export default CategoryAdministration;

CategoryAdministration.propTypes = {
  /**
   * The category store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  categoryStore: MobXPropTypes.observableArray
};