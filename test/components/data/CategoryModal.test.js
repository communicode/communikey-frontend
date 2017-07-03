import React from "react";
import { shallow } from "enzyme";
import CategoryModal from "../../../src/components/data/CategoryModal";
import { categories, groups, emptyFunction } from "../../__mockData__/mockUtil";
import { toJS } from "mobx";

describe('<CategoryModal>', () => {
  test('should render correctly with sample data', () => {
    const wrapper = shallow(<CategoryModal category={categories[0]} onClose={emptyFunction} userGroups={toJS(groups)}/>);
    expect(wrapper).toMatchSnapshot();
  });
});