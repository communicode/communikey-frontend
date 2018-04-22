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
import React from "react";
import {shallow} from "enzyme";
import toJson from 'enzyme-to-json';
import CategoryTree from "../../../../src/components/data/views/CategoryTree";
import {categoryStore, emptyFunction} from "../../../__mockData__/mockUtil";

describe('<CategoryTree>', () => {
  test('should render correctly with sample data', () => {
    const wrapper = shallow(<CategoryTree categories={categoryStore.categories} onSelect={emptyFunction}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});