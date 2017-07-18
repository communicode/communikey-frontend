import React from "react";
import {mount} from "enzyme";
import CategoryModal from "../../../src/components/data/CategoryModal";
import {categoryStore, userGroupStore, stores, emptyFunction} from "../../__mockData__/mockUtil";
import {toJS} from "mobx";
import {Provider} from "mobx-react";

describe("<CategoryModal>", () => {
  test("should render correctly with sample data", () => {
    const wrapper = mount(
      <Provider {...stores}>
        <CategoryModal category={categoryStore.categories[0]} onClose={emptyFunction} userGroups={toJS(userGroupStore.userGroups)}/>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});