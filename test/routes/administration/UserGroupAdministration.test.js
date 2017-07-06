jest.mock("../../../src/Communikey", () => require("../../__mockData__/mockUtil"));
import React from "react";
import {mount} from "enzyme";
import UserGroupAdministration from "../../../src/routes/administration/UserGroupAdministration";
import {stores} from "../../__mockData__/mockUtil";
import {Provider} from "mobx-react";

describe("<UserGroupAdministration>", () => {
  test("should render correctly with sample data", () => {
    const wrapper = mount(
      <Provider {...stores}>
        <UserGroupAdministration/>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});