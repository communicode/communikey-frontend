import React from "react";
import {shallow} from "enzyme";
import CategoryModal from "../../../src/components/data/CategoryModal";
import {categoryStore, userGroupStore, emptyFunction} from "../../__mockData__/mockUtil";
import {toJS} from "mobx";

describe("<CategoryModal>", () => {
  test("should render correctly with sample data", () => {
    const wrapper = shallow(<CategoryModal category={categoryStore.categories[0]} onClose={emptyFunction} userGroups={toJS(userGroupStore.userGroups)}/>);
    expect(wrapper).toMatchSnapshot();
  });
});