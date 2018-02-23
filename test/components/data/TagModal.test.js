jest.mock("../../../src/Communikey", () => require("../../__mockData__/mockUtil"));
import React from "react";
import {mount} from "enzyme";
import TagModal from "../../../src/components/data/TagModal";
import {tagStore, emptyFunction} from "../../__mockData__/mockUtil";
import {toJS} from "mobx";

describe("<TagModal>", () => {
  test("should render correctly with sample data", () => {
    const wrapper = mount(
        <TagModal
          onClose={emptyFunction}
          tag={tagStore.tags[0]}
        />
    );
    expect(wrapper).toMatchSnapshot();
  });
});