import React from "react";
import { shallow } from "enzyme";
import NoDataMessageBox from "../../../src/components/feedback/NoDataMessageBox";

describe('<NoDataMessageBox>', () => {
  test('should render correctly with sample data', () => {
    const wrapper = shallow(<NoDataMessageBox/>);
    expect(wrapper).toMatchSnapshot();
  });
});