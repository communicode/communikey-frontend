import { categoryStore } from "../CategoryStore"
import fs from 'fs'

test('Adds & deletes Category in CategoryStore', () => {
  var category;
  fs.readFile(`src/js/stores/__mocks__/__mockData__/category.json`, 'utf8', (err, data) => {
    category = JSON.parse(data);
    categoryStore.categories = [];
    categoryStore.addCategory(category);
    expect(categoryStore.categories[0]).toBe(category);
    delete categoryStore.categories[0];
    expect(categoryStore.categories[0]).toBe(undefined);
  });
});