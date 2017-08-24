jest.mock("../../src/services/ApiService", () => require("../__mockData__/MockApiService"));
jest.mock("../../src/Communikey", () => require("../__mockData__/mockUtil"));
import React from "react";
import {mount} from "enzyme";
import Keys from "../../src/routes/Keys";
import {stores} from "../__mockData__/mockUtil";
import {mockStorage} from "../__mockData__/mockLocalStorage";
import {Provider} from "mobx-react";
import {StaticRouter} from "react-router-dom";

describe("<Keys>", () => {
  test("should render correctly with sample data", () => {
    global.localStorage = mockStorage;
    const context = {};
    const wrapper = mount(
      <StaticRouter location="/keys" context={context}>
        <Provider {...stores}>
          <Keys/>
        </Provider>
      </StaticRouter>
    );

    // Filtering the rendered output from circular references and random generated ids
    let cache = [];
    let result = JSON.stringify(wrapper, function(key, value) {
      if (typeof value === "object" && value !== null) {
        if (cache.indexOf(value) !== -1 || key.toString().startsWith("__reactInternalInstance") || key.toString().startsWith("_ownerDocument")) {
          return;
        }
        cache.push(value);
      }
      return value;
    }, 4);

    expect(result).toMatchSnapshot();
  });
});