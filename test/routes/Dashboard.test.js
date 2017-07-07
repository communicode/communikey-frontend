import React from "react";
import {mount} from "enzyme";
import Dashboard from "../../src/routes/Dashboard";

describe("<Dashboard>", () => {
  test("should render correctly", () => {
    const wrapper = mount(
      <Dashboard/>
    );
    expect(wrapper).toMatchSnapshot();
  });
});