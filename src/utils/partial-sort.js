/**
 * Returns an object array with all of the original items in it, but with the
 * [keyToFilter]: valueToFilter subset of the array sorted and at the end of the
 * array.
 * @param sourceArray Object array that includes all available entries
 * @param keyToFilter Key in object to filter
 * @param valueToFilter Value of key to filter
 * @param sorter sort function with (a, b) for parameters and returns -1,0,1
 * @returns {*[]}
 */
const partialSort = (sourceArray, keyToFilter, valueToFilter, sorter) => {
  // clone incoming array
  let _sourceArray = sourceArray.slice();

  // get array entries to sort.
  const workingList = _sourceArray.filter((i) => i[keyToFilter] === valueToFilter);

  // remove those entries from the sourceArray.
  _sourceArray = _sourceArray.filter((i) => i[keyToFilter] !== valueToFilter);

  // sort the items we're looking for
  workingList.sort(sorter);

  // add the sorted items back to source array
  _sourceArray = [..._sourceArray, ...workingList];
  return _sourceArray;
};

exports.partialSort = partialSort;
