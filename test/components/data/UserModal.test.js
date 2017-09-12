import React from "react";
import {mount} from "enzyme";
import UserModal from "../../../src/components/data/UserModal";
import {authorityStore, userStore, emptyFunction} from "../../__mockData__/mockUtil";
jest.mock("../../../src/Communikey", () => require("../../__mockData__/mockUtil"));
import {Provider} from "mobx-react";
import {toJS} from "mobx";

describe("<UserModal>", () => {
  test("should render correctly with sample data", () => {
    const wrapper = mount(
        <UserModal onClose={emptyFunction} user={userStore.users[0]} authorities={toJS(authorityStore.authorities)}/>
    );
    expect(wrapper).toMatchSnapshot();
  });
});