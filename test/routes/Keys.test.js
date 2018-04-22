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