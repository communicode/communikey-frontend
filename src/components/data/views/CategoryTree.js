import React from "react";
import PropTypes from "prop-types";
import {PropTypes as MobXPropTypes} from "mobx-react";
import {Icon, Tree} from "antd";
import "antd/lib/icon/style/css";
import "antd/lib/tree/style/index.less";
import "./CategoryTree.less";

/**
 * A tree for categories.
 *
 * @author sgreb@communicode.de
 * @since 0.8.0
 */
class CategoryTree extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Recursivly generates all tree nodes.
   *
   * @param categories
   */
  generateTreeNodes = categories => categories.map(category => {
    if (category.children.length) {
      return (
        <Tree.TreeNode key={category.id} title={<span><Icon type="folder"/> {category.name}</span>} category={category}>
          {this.generateTreeNodes(category.children)}
        </Tree.TreeNode>
      );
    }
    return <Tree.TreeNode key={category.id} title={category.name} category={category}/>;
  });

  render() {
    const {categories, expandedKeys, onDrop, onExpand, onSelect, selectedKeys, draggable, ...treeProps} = this.props;

    return (
      <Tree
        {...treeProps}
        draggable={draggable}
        expandedKeys={expandedKeys}
        onDrop={onDrop}
        onExpand={onExpand}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
      >
        {this.generateTreeNodes(categories)}
      </Tree>
    );
  }
}

CategoryTree.propTypes = {
  /**
   * The categories.
   */
  categories: MobXPropTypes.observableArray.isRequired,

  /**
   * Determines if tree nodes can be dragged.
   */
  draggable: PropTypes.bool.isRequired,

  /**
   * The currently expanded keys.
   */
  expandedKeys: PropTypes.array.isRequired,

  /**
   * Callback function to handle drop events.
   */
  onDrop: PropTypes.func.isRequired,

  /**
   * Callback function to handle expand events.
   */
  onExpand: PropTypes.func.isRequired,

  /**
   * Callback function to handle selection events.
   */
  onSelect: PropTypes.func.isRequired,

  /**
   * Determines the current processing status.
   */
  processing: PropTypes.bool.isRequired,

  /**
   * The currently selected keys.
   */
  selectedKeys: PropTypes.array.isRequired
};

export default CategoryTree;