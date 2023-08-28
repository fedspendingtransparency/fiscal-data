import determineDateRange, {
  analyticsFields,
  generateFormattedDate,
  generateAnalyticsEvent
} from './helper';
import Analytics from "../../../../utils/analytics/analytics";
import {PRESETS, TABLE_OBJ} from "./test-helper";
import {formatDate} from "../../../download-wrapper/helpers";

describe('Range Presets Helpers - determineDateRange', () => {

  it('returns null when either of its inputs are falsy', () => {
    expect(determineDateRange(TABLE_OBJ, null)).toBeNull();
    expect(determineDateRange(null, PRESETS.current)).toBeNull();
  });
  it('returns null if the preset is not set properly', () => {
    expect(determineDateRange(TABLE_OBJ, {key: 'Pickle'})).toBeNull();
    expect(determineDateRange(TABLE_OBJ, {years: 'Rick'}));
  });
  it('returns date object if inputs are valid', () => {
    expect(determineDateRange(TABLE_OBJ, PRESETS.current).selectionPath)
      .toStrictEqual(PRESETS.current.expectedPath);
    expect(determineDateRange(TABLE_OBJ, PRESETS.all).selectionPath)
      .toStrictEqual(PRESETS.all.expectedPath);
    const yearsArr = PRESETS.years;
    for(let i = yearsArr.length; i--;){
      const year = yearsArr[i];
      expect(determineDateRange(TABLE_OBJ, year).selectionPath).toStrictEqual(year.expectedPath);
    }
  });

  // it('sets the date range to the entire month of the most recent date available, ' +
  //   'when currentDateButton is set to byMonth', () => {
  //   expect(determineDateRange(TABLE_OBJ, PRESETS.current, 'byMonth').selectionPath)
  // .toStrictEqual(PRESETS.current.expectedPath);
  //
  //   expect(formatDate(determineDateRange(TABLE_OBJ, PRESETS.current, 'byMonth').from))
  // .toStrictEqual('01/01/2021');
  //
  //   expect(formatDate(determineDateRange(TABLE_OBJ, PRESETS.current, 'byMonth').to))
  // .toStrictEqual('01/06/2021');
  // });
});

describe('Range Presets Helpers - generateFormattedDate', () => {
  const fromDate = new Date(2003, 9,1);
  const toDate = new Date(2021, 8,30);
  const dateRangeObj = {from: fromDate, to: toDate};
  const dateRangeStr = `10/01/2003 - 09/30/2021`;

  it('returns an empty string if the inputs are invalid', () => {
    expect(generateFormattedDate(null)).toStrictEqual('');
    expect(generateFormattedDate({from: fromDate})).toStrictEqual('');
    expect(generateFormattedDate({to: toDate})).toStrictEqual('');
  });

  it('returns a date range string used for display purposes', () => {
    expect(generateFormattedDate(dateRangeObj)).toStrictEqual(dateRangeStr);
  })

});

describe('Range Presets Helpers - generateAnalyticsEvent', () => {
  const spy = jest.spyOn(Analytics, 'event');

  it('does not trigger an Analytics event if no label is provided', () => {
    generateAnalyticsEvent('');
    expect(spy).not.toHaveBeenCalled();
  });

  it('triggers an Analytics event with expected fields', () => {
    window.dataLayer = window.dataLayer || [];
    const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

    const label = 'Test event label';
    const desiredEventFields = Object.assign({}, analyticsFields);
    desiredEventFields.label = label;

    generateAnalyticsEvent(label);
    expect(spy).toHaveBeenCalledWith(desiredEventFields);

    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'Pick Date Click',
      eventLabel: label
    });
  });

});
