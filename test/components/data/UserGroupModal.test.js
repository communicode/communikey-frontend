import React from "react";
import { shallow } from "enzyme";
import UserGroupModal from "../../../src/components/data/UserGroupModal";
import { groups, users, emptyFunction } from "../../__mockData__/mockUtil";
import { toJS } from "mobx";

describe('<UserGroup>', () => {
  test('should render correctly with sample data', () => {
    const wrapper = shallow(<UserGroupModal onClose={emptyFunction} userGroup={groups[0]} users={toJS(users)}/>);
    expect(wrapper).toMatchSnapshot();
  });
});