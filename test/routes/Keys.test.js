jest.mock("../../src/services/ApiService", () => require("../__mockData__/MockApiService"));
import React from "react";
import {mount} from "enzyme";
import Keys from "../../src/routes/Keys";
import {mockStorage, stores} from "../__mockData__/mockUtil";
import {Provider} from "mobx-react";

describe("<Keys>", () => {
  test("should render correctly with sample data", () => {
    global.localStorage = mockStorage;
    const wrapper = mount(
      <Provider {...stores}>
        <Keys/>
      </Provider>
    );

    // Filtering the rendered output from circular references and random generated ids
    var cache = [];
    var result = JSON.stringify(wrapper, function(key, value) {
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