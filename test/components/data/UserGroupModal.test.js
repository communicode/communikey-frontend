import React from "react";
import {shallow} from "enzyme";
import UserGroupModal from "../../../src/components/data/UserGroupModal";
import {userGroupStore, userStore, emptyFunction} from "../../__mockData__/mockUtil";
import {toJS} from "mobx";

describe("<UserGroupModal>", () => {
  test("should render correctly with sample data", () => {
    const wrapper = shallow(<UserGroupModal onClose={emptyFunction} userGroup={userGroupStore.userGroups[0]} users={toJS(userStore.users)}/>);
    expect(wrapper).toMatchSnapshot();
  });
});