/* istanbul ignore file */
// These are configurable sort orders, and it's not clear this file is a good candidate for tests
export const customTableSorts = {
  '137': (rowA, rowB) => {
    if (rowA['country'].toUpperCase() > rowB['country'].toUpperCase()) {
      return 1;
    } else if (rowA['country'].toUpperCase() < rowB['country'].toUpperCase()) {
      return -1;
    } else if (((!rowA['effective_date']) || rowA['effective_date'] === 'null') &&
      ((!rowB['effective_date']) || rowB['effective_date'] === 'null')) {
      if (rowA['record_date'] > rowB['record_date']) {
        return -1;
      } else {
        return 1;
      }
    } else if ((!rowA['effective_date']) || rowA['effective_date'] === 'null') {
      return 1;
    } else if ((!rowB['effective_date']) || rowB['effective_date'] === 'null') {
      return -1;
    } else if (rowA['effective_date'] > rowB['effective_date']) {
      return -1;
    } else {
      return 1;
    }
  }
}
