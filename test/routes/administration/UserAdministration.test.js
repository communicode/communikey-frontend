jest.mock("../../../src/Communikey", () => require("../../__mockData__/mockUtil"));
import React from "react";
import {mount} from "enzyme";
import UserAdministration from "../../../src/routes/administration/UserAdministration";
import {stores} from "../../__mockData__/mockUtil";
import {Provider} from "mobx-react";

describe("<UserAdministration>", () => {
  test("should render correctly with sample data", () => {
    const wrapper = mount(
      <Provider {...stores}>
        <UserAdministration/>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});