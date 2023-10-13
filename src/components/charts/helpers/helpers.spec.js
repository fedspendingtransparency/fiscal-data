import { aggregator, reducer } from './helpers';
import testData, { staggeredData } from './helpersData';

describe('Chart helpers', () => {
  describe('aggregator function', () => {
    it('returns a blank object if input params are invalid', () => {
      const expectedReturn = {};
      expect(aggregator(null, null, null)).toStrictEqual(expectedReturn);
      expect(aggregator(staggeredData, '', testData.staggeredValueKeys)).toStrictEqual(expectedReturn);
      expect(aggregator([], testData.staggeredGroupKey, testData.staggeredValueKeys)).toStrictEqual(expectedReturn);
      expect(aggregator(staggeredData, testData.staggeredGroupKey, [])).toStrictEqual(expectedReturn);
    });

    it('groups an array of uncompressed data to an object of compressed data with groupKey value pairs', () => {
      expect(aggregator(staggeredData, testData.staggeredGroupKey, testData.staggeredValueKeys)).toStrictEqual(testData.staggeredGroupedData);
    });
  });

  describe('reducer function', () => {
    it('returns a blank array if input params are invalid', () => {
      const expectedReturn = [];
      expect(reducer(null, null, null)).toStrictEqual(expectedReturn);
      expect(reducer(staggeredData, '', testData.staggeredValueKeys)).toStrictEqual(expectedReturn);
      expect(reducer([], testData.staggeredGroupKey, testData.staggeredValueKeys)).toStrictEqual(expectedReturn);
      expect(reducer(staggeredData, testData.staggeredGroupKey, [])).toStrictEqual(expectedReturn);
    });

    it('reduced an array of uncompressed data to an array indexed by the groupKey and aggregated by the aggKeys', () => {
      expect(reducer(staggeredData, testData.staggeredGroupKey, testData.staggeredValueKeys)).toStrictEqual(testData.staggeredReducedData);
    });
  });
});
