jest.mock("../../../src/Communikey", () => require("../../__mockData__/mockUtil"));
import React from "react";
import {mount} from "enzyme";
import KeyModal from "../../../src/components/data/KeyModal";
import {categoryStore, keyStore, stores, emptyFunction} from "../../__mockData__/mockUtil";
import {Provider} from "mobx-react";

describe("<KeyModal>", () => {
  test("should render correctly with sample data", () => {
    const wrapper = mount(
      <Provider {...stores}>
        <KeyModal onClose={emptyFunction} cckeyKey={keyStore.keys[0]} categories={categoryStore.categories}/>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});