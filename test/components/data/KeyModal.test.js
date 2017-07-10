import React from "react";
import {shallow} from "enzyme";
import KeyModal from "../../../src/components/data/KeyModal";
import {categoryStore, keyStore, emptyFunction} from "../../__mockData__/mockUtil";

describe("<KeyModal>", () => {
  test("should render correctly with sample data", () => {
    const wrapper = shallow(<KeyModal onClose={emptyFunction} cckeyKey={keyStore.keys[0]} categories={categoryStore.categories}/>);
    expect(wrapper).toMatchSnapshot();
  });
});