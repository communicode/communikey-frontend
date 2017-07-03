import React from "react";
import { shallow } from "enzyme";
import KeyModal from "../../../src/components/data/KeyModal";
import { categories, keys, emptyFunction } from "../../__mockData__/mockUtil";

describe('<KeyModal>', () => {
  test('should render correctly with sample data', () => {
    const wrapper = shallow(<KeyModal onClose={emptyFunction} cckeyKey={keys[0]} categories={categories}/>);
    expect(wrapper).toMatchSnapshot();
  });
});