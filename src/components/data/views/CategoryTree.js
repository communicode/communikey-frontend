/*
 * This file is part of communikey.
 * Copyright (C) 2016-2018  communicode AG <communicode.de>
 *
 * communikey is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React from "react";
import {arrayToTree} from "performant-array-to-tree";
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
   * Generates the category tree from the specified flat category data array.
   *
   * @param categories - The flat category data array to generate the tree structure of
   * @since 0.9.0
   */
  generateTreeFromFlatData = categories => arrayToTree(categories, {id: "id", parentId: "parent"});

  /**
   * Recursively generates all tree nodes.
   *
   * @param categories
   */
  generateTreeNodes = categories => categories.map(category => {
    if (category.children.length) {
      return (
        <Tree.TreeNode key={category.data.id} title={<span><Icon type="folder"/> {category.data.name}</span>} category={category.data}>
          {this.generateTreeNodes(category.children)}
        </Tree.TreeNode>
      );
    }
    return <Tree.TreeNode key={category.data.id} title={category.data.name} category={category.data}/>;
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
        {this.generateTreeNodes(this.generateTreeFromFlatData(categories))}
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
  draggable: PropTypes.bool,

  /**
   * The currently expanded keys.
   */
  expandedKeys: PropTypes.array,

  /**
   * Callback function to handle drop events.
   */
  onDrop: PropTypes.func,

  /**
   * Callback function to handle expand events.
   */
  onExpand: PropTypes.func,

  /**
   * Callback function to handle selection events.
   */
  onSelect: PropTypes.func.isRequired,

  /**
   * Determines the current processing status.
   */
  processing: PropTypes.bool,

  /**
   * The currently selected keys.
   */
  selectedKeys: PropTypes.array
};

CategoryTree.defaultProps = {
  draggable: false
};

export default CategoryTree;
