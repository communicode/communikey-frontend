jest.mock("../../src/Communikey", () => require("../__mockData__/mockUtil"));
import React from "react";
import {mount} from "enzyme";
import Dashboard from "../../src/routes/Dashboard";
import {Provider} from "mobx-react";
import {stores} from "../__mockData__/mockUtil";
import {StaticRouter} from "react-router-dom";

describe("<Dashboard>", () => {
  test("should render correctly", () => {
    const context = {};
    const wrapper = mount(
      <StaticRouter location="/keys" context={context}>
        <Provider {...stores}>
          <Dashboard/>
        </Provider>
      </StaticRouter>
    );
    expect(wrapper).toMatchSnapshot();
  });
});