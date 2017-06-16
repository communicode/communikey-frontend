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
export const USER_TABLE_DEFAULT_ACTIVATION_BADGE_RECORD = (record) =>
  <Badge status={record.activated ? "success" : "error"} text={record.activated ? "Activated" : "Deactivated"}/>;

/**
 * The default table column configuration.
 */
export const USER_TABLE_DEFAULT_COLUMNS = [
  {title: "Login", dataIndex: "login", key: "login", fixed: true},
  {title: "Email", dataIndex: "email", key: "email"},
  {title: "First name", dataIndex: "firstName", key: "firstName"},
  {title: "Last name", dataIndex: "lastName", key: "lastName"},
  {
    title: "Status", render: USER_TABLE_DEFAULT_ACTIVATION_BADGE_RECORD
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
  columns: USER_TABLE_DEFAULT_COLUMNS,
  scroll: {x: 992}
};

export default UserTable;
