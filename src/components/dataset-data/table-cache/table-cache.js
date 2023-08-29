import { addDays, isAfter, isBefore, isEqual, subDays } from "date-fns";
import { formatDateForApi } from '../../../utils/api-utils';
import { pivotApiData } from '../dataset-data-api-helper/dataset-data-api-helper';

export class TableCache {

  constructor() {
    this.dataCache = [];
    this.dataDisplayCache = {};
  }

  updateDataCache = (fetchedRecordSets) => {
    this.dataCache.push(...fetchedRecordSets);
    // keep recordSet segments in date-descending order
    return this.dataCache.sort((a, b) => b.range.from - a.range.from);
  };

  findUncachedDateRanges = (requestedRange, neededRanges = []) => {
    const unaccountedRange = Object.assign({}, requestedRange);

    // check to see if we already have coverage at the end of the range
    const cachedRangeWithSomeEndCoverage = this.dataCache.find(cache => !isBefore(cache.range.to, requestedRange.to) &&
      !isAfter(cache.range.from, requestedRange.to));
    if (cachedRangeWithSomeEndCoverage) {

      // if the cached range that covers the end also reached to the beginning of the requested range, we're done.
      if (!isAfter(cachedRangeWithSomeEndCoverage.range.from, requestedRange.from)) {
        return neededRanges;
      } else {
        // otherwise chop off the end of the requested range as far as the first overlapping range will allow and recurse
        unaccountedRange.to = subDays(cachedRangeWithSomeEndCoverage.range.from, 1);
        return this.findUncachedDateRanges(unaccountedRange, neededRanges);
      }
    } else {

      // no coverage at the front of the range, so see if there's any coverage in the cache starting after the requested from date
      const cachedRangeWithSomeEarlierCoverage = this.dataCache.find(cache => !isBefore(cache.range.to, requestedRange.from) &&
        !isAfter(cache.range.from, requestedRange.to));
      if (cachedRangeWithSomeEarlierCoverage) {
        // if the coverage extends to the beginning of the range requested, set requested from-date
        // to the day after coverage ends; return the needed ranges
        if (!isAfter(cachedRangeWithSomeEarlierCoverage.range.from, requestedRange.from)) {
          unaccountedRange.from = addDays(cachedRangeWithSomeEarlierCoverage.range.to, 1);
          neededRanges.push(unaccountedRange);
          return neededRanges;
        } else {
          // chop the requested range into 2 parts. Add the part that comes after coverage to the neededRanges
          // array and use the part that comes before as the new requested range
          neededRanges.push({from: addDays(cachedRangeWithSomeEarlierCoverage.range.to, 1), to: requestedRange.to});
          return this.findUncachedDateRanges(
            {
              from: requestedRange.from,
              to: subDays(cachedRangeWithSomeEarlierCoverage.range.from, 1)
            }, neededRanges);
        }
      } else {
        // couldn't find any coverage at all, so add the latest requested range as one that will need
        // to be loaded and return it along with any other neededRanges
        neededRanges.push(requestedRange);
        return neededRanges;
      }
    }
  };

  updateDataDisplayCache = (data, dateRange) => {
    const rangeKey = `${formatDateForApi(dateRange.from)}:${formatDateForApi(dateRange.to)}`;
    this.dataDisplayCache[rangeKey] = this.dataDisplayCache[rangeKey] || {};

    if (data && data.pivotApplied) {
      this.dataDisplayCache[rangeKey][data.pivotApplied] = data;
    } else {
      this.dataDisplayCache[rangeKey].all = data;
    }
  };

  getCachedDataDisplay = (dateRange, selectedPivot, selectedTable) => {
    const rangeFrom = formatDateForApi(dateRange.from);
    const rangeTo = formatDateForApi(dateRange.to);
    const rangeKey = `${rangeFrom}:${rangeTo}`;
    const pivotKey = (selectedPivot && selectedPivot.pivotView && selectedPivot.pivotView.dimensionField) ?
      `${selectedPivot.pivotView.title}:${selectedPivot.pivotValue.columnName}` :
      'all';

    this.dataDisplayCache[rangeKey] = this.dataDisplayCache[rangeKey] || {};

    // display ready data is already cached, so just return it and be done
    if (this.dataDisplayCache[rangeKey][pivotKey]) return this.dataDisplayCache[rangeKey][pivotKey];

    // didn't have the pivot display data cached so check cache for Complete Table display data
    if (this.dataDisplayCache[rangeKey].all) {
      const pivotDisplay = pivotApiData(selectedTable, selectedPivot, this.dataDisplayCache[rangeKey].all, rangeFrom, rangeTo);
      this.dataDisplayCache[rangeKey][pivotKey] = pivotDisplay;
      return pivotDisplay;
    } else return null;
  };

  getRecordSetForRange = (dateRange, dateField) => {
    // use this for quick numeric comparisons when performing row-level filtering
    const numerifyRecordDate = dateValueString => dateValueString ? Number(dateValueString.replace(/-/g, '')) : 0;

    // filter out cached segments whose records fall completely outside the current target date range
    const relevantSegments = this.dataCache.filter(segment => !isBefore(segment.range.to, dateRange.from) &&
      !isAfter(segment.range.from, dateRange.to));

    let recordsForRange;
    if (isEqual(relevantSegments[relevantSegments.length - 1].range.from, dateRange.from) &&
      isEqual(relevantSegments[0].range.to, dateRange.to)) {

      // the relevant segments constitute and exact match for the dateRange, so skip row-level date filtering
      recordsForRange = [].concat(...relevantSegments.map(rs => rs.data));
    } else {
      // otherwise perform row-level date filtering
      const recordArrays = this.dataCache.map(rs => rs.data);
      const rangeFromNumber = numerifyRecordDate(formatDateForApi(dateRange.from));
      const rangeToNumber = numerifyRecordDate(formatDateForApi(dateRange.to));
      recordsForRange = [].concat(...recordArrays).filter(rec => {
        const numericDate = numerifyRecordDate(rec[dateField]);
        return numericDate >= rangeFromNumber && numericDate <= rangeToNumber;
      });
    }
    const artificialMeta = Object.assign({}, this.dataCache[0].meta);
    artificialMeta.count = recordsForRange.length;
    // bundle the data with metadata and return it
    return {
      data: recordsForRange,
      meta: artificialMeta
    };
  }
}
