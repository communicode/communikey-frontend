import React from "react";
import { shallow } from "enzyme";
import CategoryModal from "../../../src/components/data/CategoryModal";
import { categories, emptyFunction } from "../../__mockData__/mockUtil";

describe('<CategoryModal>', () => {
  test('should render correctly with sample data', () => {
    const wrapper = shallow(<CategoryModal category={categories[0]} onClose={emptyFunction}/>);
    expect(wrapper).toMatchSnapshot();
  });
});