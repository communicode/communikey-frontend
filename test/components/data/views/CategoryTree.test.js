import React from "react";
import renderer from "react-test-renderer";
import CategoryTree from "../src/components/data/views/CategoryTree";
import {observable} from "mobx";

jest.mock("../src/components/data/views/CategoryTree.less", () => jest.fn());
jest.mock("antd/lib/tree/style/index.less", () => jest.fn());
jest.mock("antd/lib/icon/style/css", () => jest.fn());

const mockedCategories = observable();

describe('<CategoryTree>', () => {
  test('should render correctly with sample data', () => {
    console.log(mockedCategories.length);

    const categoryTree = renderer.create(
      <CategoryTree categories={mockedCategories}/>
    );
    expect(categoryTree).toMatchSnapshot();
  });
});