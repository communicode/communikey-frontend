jest.mock("../../../src/Communikey", () => require("../../__mockData__/mockUtil"));
import React from "react";
import {mount} from "enzyme";
import UserModal from "../../../src/components/data/UserModal";
import {authorityStore, userStore, emptyFunction} from "../../__mockData__/mockUtil";
import {toJS} from "mobx";

describe("<UserModal>", () => {
  test("should render correctly with sample data", () => {
    const wrapper = mount(
        <UserModal
          onClose={emptyFunction}
          user={userStore.users[0]}
          groups={toJS(userStore.users)}
          authorities={toJS(authorityStore.authorities)}
        />
    );
    expect(wrapper).toMatchSnapshot();
  });
});