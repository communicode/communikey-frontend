jest.mock("react-router-dom", () => require("../__mockData__/mockReactRouterDOM"));
import React from "react";
import {mount} from "enzyme";
import Dashboard from "../../src/routes/SignOut";
import {stores} from "../__mockData__/mockUtil";
import {mockStorage} from "../__mockData__/mockLocalStorage";
import {Provider} from "mobx-react";
import {LOCAL_STORAGE_ACCESS_TOKEN} from "../../src/config/constants";

describe("<SignOut>", () => {
  test("should clear the local storage", () => {
    global.localStorage = mockStorage;
    expect(mockStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)).toBe("mockedItem");
    const wrapper = mount(
      <Provider {...stores}>
        <Dashboard/>
      </Provider>
    );
    expect(mockStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)).toBe("clearedItem");
  });
});