jest.mock("../../src/Communikey", () => require("../__mockData__/mockUtil"));
import React from "react";
import {mount} from "enzyme";
import SignIn from "../../src/routes/SignIn";
import {stores} from "../__mockData__/mockUtil";
import {Provider} from "mobx-react";

describe("<SignIn>", () => {
  test("should render correctly with sample data", () => {
    const wrapper = mount(
      <Provider {...stores}>
        <SignIn/>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});