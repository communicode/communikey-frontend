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