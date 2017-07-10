export let mockStorage = {
  exampleItem: "mockedItem",
  getItem() {
    return this.exampleItem;
  },
  setItem() {},
  clear() {
    this.exampleItem = "clearedItem"
  }
};