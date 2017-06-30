import React from "react";
import { shallow } from "enzyme";
import CategoryTree from "../../../../src/components/data/views/CategoryTree";
import { categories, emptyFunction } from "../../../__mockData__/mockUtil";

describe('<CategoryTree>', () => {
  test('should render correctly with sample data', () => {
    const wrapper = shallow(<CategoryTree categories={categories} onSelect={emptyFunction}/>);
    expect(wrapper).toMatchSnapshot();
  });
});