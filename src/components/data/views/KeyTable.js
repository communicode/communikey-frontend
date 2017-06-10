import React from "react";
import PropTypes from "prop-types";
import {Table} from "antd";
import "antd/lib/pagination/style/index.less";
import "antd/lib/table/style/index.less";

/**
 * The default table column configuration.
 */
export const KEY_TABLE_DEFAULT_COLUMNS = [
  {title: "Name", dataIndex: "name", key: "name", fixed: true},
  {title: "Login", dataIndex: "login", key: "login"},
  {title: "Category", dataIndex: "category.name", key: "category.name"}
];

/**
 * A table for keys.
 *
 * @author sgreb@communicode.de
 * @since 0.8.0
 */
class KeyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
    const {loading} = this.state;
    const {columns, scroll, ...tableProps} = this.props;

    return (
      <Table
        columns={columns}
        loading={loading}
        rowKey={record => record.id}
        scroll={scroll}
        {...tableProps}
      />
    );
  }
}

KeyTable.propTypes = {
  /**
   * The table columns.
   *
   * @type {array}
   */
  columns: PropTypes.array,

  /**
   * The data source of table records.
   *
   * @type {array}
   */
  dataSource: PropTypes.array.isRequired,

  /**
   * The configuration for vertical- and horizontal fixed scrolls.
   *
   * @type {object}
   */
  scroll: PropTypes.object
};

KeyTable.defaultProps = {
  columns: KEY_TABLE_DEFAULT_COLUMNS,
  scroll: {x: 992}
};

export default KeyTable;
