/**
 * Takes a large array of data and transforms it into an object grouped by the groupKey param and aggregated by the aggKeys.
 * @param dataArr {Array} - Array of uncompressed data
 * @param groupKey {String} - The API field name for how to group the data. Eg. To group data by years we could use "record_calendar_year"
 * @param aggKeys {String[]} - The API field name for what data to aggregate as it is being grouped.
 * @returns {*} - Object whose keys are built off groupKey and whose value contains the remaining data relative to that group
 *                with aggregated data.
 */
export const aggregator = (dataArr, groupKey, aggKeys) => {
  if (!dataArr || !dataArr.length || !groupKey || !aggKeys || !aggKeys.length){
    return {};
  }

  // Copy the array to keep the integrity of the data from dataArr
  const arr = JSON.parse(JSON.stringify(dataArr));

  // Loop through all aggregate keys on the new object's key instance and set the initial values as Numberic values and aggregate on follow-up calls.
  const setAggregateValues = (obj, key, d, isInitial) => {
    for(let i = aggKeys.length; i--;){
      const curKey = aggKeys[i];
      const aggVal = !isNaN(Number(d[curKey])) ? Number(d[curKey]) : 0;
      if(isInitial) {
        obj[key][curKey] = aggVal;
      } else {
        obj[key][curKey] += aggVal;
      }
    }
  };

  // Group the data from the input array and return as an object.
  return arr.reduce((obj, d) => {
    const key = d[groupKey];
    let isInitial = true;
    if(!obj[key]){
      obj[key] = d;
    } else {
      isInitial = false;
    }
    setAggregateValues(obj, key, d, isInitial);
    return obj;
  }, {});
};

/**
 * Reduces a large array of data into a smaller grouped and aggregated array of data points.
 * @param dataArr {Array} - Array of uncompressed data
 * @param groupKey {String} - The API field name for how to group the data. Eg. To group data by year we could use "record_calendar_year"
 * @param aggKeys[] {String} - The API field name(s) for what data to aggregate as it is being grouped.
 * @returns {Array|*[]} - Array of compressed data that has been grouped and aggregated.
 */
export const reducer = (dataArr, groupKey, aggKeys) => {
  let reducedArr = [];
  if(!dataArr || !dataArr.length || !groupKey || !aggKeys || !aggKeys.length){
    return reducedArr;
  }

  const aggregatedObj = aggregator(dataArr, groupKey, aggKeys);
  reducedArr = Object.keys(aggregatedObj).map(d => aggregatedObj[d]);
  return reducedArr;
};

export const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
