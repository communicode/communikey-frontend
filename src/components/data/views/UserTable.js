import React from "react";
import PropTypes from "prop-types";
import {Badge, Table} from "antd";
import "antd/lib/badge/style/index.less";
import "antd/lib/pagination/style/index.less";
import "antd/lib/table/style/index.less";

/**
 * A badge component to show the current activation status of a user.
 *
 * @param {object} record - The user table record
 * @constructor
 */
const DEFAULT_BADGE_COLUMN = (record) => <Badge status={record.activated ? "success" : "error"} text={record.activated ? "Activated" : "Deactivated"}/>;

/**
 * The default table column configuration.
 */
const DEFAULT_COLUMNS = [
  {title: "ID", dataIndex: "id", key: "id", fixed: "left", width: 100},
  {title: "Login", dataIndex: "login", key: "login", fixed: "left", width: 100},
  {title: "Email", dataIndex: "email", key: "email"},
  {title: "First name", dataIndex: "firstName", key: "firstName"},
  {title: "Last name", dataIndex: "lastName", key: "lastName"},
  {
    title: "Status", width: 100, render: DEFAULT_BADGE_COLUMN
  }
];

/**
 * A table for user.
 *
 * @author sgreb@communicode.de
 * @since 0.8.0
 */
class UserTable extends React.Component {
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

UserTable.propTypes = {
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

UserTable.defaultProps = {
  columns: DEFAULT_COLUMNS,
  scroll: {x: 992}
};

export default UserTable;