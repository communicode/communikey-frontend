import React from "react";
import { shallow } from "enzyme";
import UserModal from "../../../src/components/data/UserModal";
import { users, emptyFunction } from "../../__mockData__/mockUtil";

describe('<UserModal>', () => {
  test('should render correctly with sample data', () => {
    const wrapper = shallow(<UserModal onClose={emptyFunction} user={users[0]}/>);
    expect(wrapper).toMatchSnapshot();
  });
});