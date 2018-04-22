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