/*
 * This file is part of communikey.
 * Copyright (C) 2016-2018  communicode AG <communicode.de>
 *
 * communikey is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
jest.mock("react-router-dom", () => require("../__mockData__/mockReactRouterDOM"));
jest.mock("../../src/Communikey", () => require("../__mockData__/mockUtil"));
import React from "react";
import {mount} from "enzyme";
import SignOut from "../../src/routes/SignOut";
import {stores} from "../__mockData__/mockUtil";
import {mockStorage} from "../__mockData__/mockLocalStorage";
import {Provider} from "mobx-react";
import {LOCAL_STORAGE_ACCESS_TOKEN} from "../../src/config/constants";

describe("<SignOut>", () => {
  test("should clear the local storage", () => {
    global.localStorage = mockStorage;
    expect(mockStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)).toEqual("mockedItem");
    const wrapper = mount(
      <Provider {...stores}>
        <SignOut location={{}}/>
      </Provider>
    );
    expect(mockStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)).toEqual("clearedItem");
  });
  test("should reset the AuthStore", () => {
    const spy = jest.spyOn(stores.authStore, "_reset");
    global.localStorage = mockStorage;
    const wrapper = mount(
      <Provider {...stores}>
        <SignOut location={{}}/>
      </Provider>
    );
    expect(spy).toHaveBeenCalled();
  });
});