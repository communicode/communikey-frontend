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
jest.mock("../../../src/Communikey", () => require("../../__mockData__/mockUtil"));
import React from "react";
import {mount} from "enzyme";
import TagModal from "../../../src/components/data/TagModal";
import {tagStore, emptyFunction} from "../../__mockData__/mockUtil";
import {toJS} from "mobx";

describe("<TagModal>", () => {
  test("should render correctly with sample data", () => {
    const wrapper = mount(
        <TagModal
          onClose={emptyFunction}
          tag={tagStore.tags[0]}
        />
    );
    expect(wrapper).toMatchSnapshot();
  });
});