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
    if (category.children.length > 0) {
      return (
        <Tree.TreeNode key={category.id} title={<span><Icon type="folder"/> {category.name}</span>} category={category}>
          {this.generateTreeNodes(category.children)}
        </Tree.TreeNode>
      );
    }
    return <Tree.TreeNode key={category.id} title={category.name} category={category}/>;
  });

  render() {
    const {categories, expandedKeys, onExpand, onSelect, selectedKeys, ...treeProps} = this.props;

    return (
      <Tree
        {...treeProps}
        expandedKeys={expandedKeys}
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
   * The currently expanded keys.
   */
  expandedKeys: PropTypes.array.isRequired,

  /**
   * Callback function to handle expand events.
   */
  onExpand: PropTypes.func.isRequired,

  /**
   * Callback function to handle selection events.
   */
  onSelect: PropTypes.func.isRequired,

  /**
   * The currently selected keys.
   */
  selectedKeys: PropTypes.array.isRequired
};

export default CategoryTree;