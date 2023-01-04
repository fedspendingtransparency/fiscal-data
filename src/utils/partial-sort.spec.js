const { partialSort } = require("./partial-sort")


describe('Partial Sort', () => {

  let testSortArray;

  beforeEach(() => {
    testSortArray = [
      { group: 'a', id: 'test3' },
      { group: 'b', id: 'test9' },
      { group: 'a', id: 'test1' }
    ];
  });

  it('sorts group within array a', () => {
    const arrayUT = partialSort(
      testSortArray,
      'group',
      'a',
      (a, b) => {
        if (a.id > b.id) return 1;
        if (a.id < b.id) return -1;
        return 0;
      });

    expect(arrayUT.map((i) => i.id)).toEqual(['test9', 'test1', 'test3']);
  });

});
