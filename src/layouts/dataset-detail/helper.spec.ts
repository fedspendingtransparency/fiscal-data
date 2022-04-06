import Analytics from '../../utils/analytics/analytics';
import { analyticsCategory, getAnalyticsFields, generateAnalyticsEvent } from "./helper";
import {IAnalyticsEvents} from "../../models/IAnalyticsEvents";

describe('Dataset Detail Helper - getAnalyticsFields', () => {
  const analyticsEventsObj: IAnalyticsEvents = {
    action: null,
    category: null,
    label: null,
  };

  it('returns the analytics events object with empty string values if params are invalid',
    () => {
      const returnObj = getAnalyticsFields('');
      expect(Object.values(returnObj).every((value) => value === '')).toBeTruthy();
    });

  it(`returns the analytics events object with desired values`, () => {
    const label = `Testing label`;

    analyticsEventsObj.category = analyticsCategory;
    analyticsEventsObj.action = `${label} Click`;
    analyticsEventsObj.label = label;
    let returnObj = getAnalyticsFields(label);

    expect(analyticsEventsObj.category).toStrictEqual(returnObj.category);
    expect(analyticsEventsObj.action).toStrictEqual(returnObj.action);
    expect(analyticsEventsObj.label).toStrictEqual(returnObj.label);

    const action = 'First unique action';
    returnObj = getAnalyticsFields(label, action);
    analyticsEventsObj.action = action;

    expect(analyticsEventsObj.category).toStrictEqual(returnObj.category);
    expect(analyticsEventsObj.action).toStrictEqual(returnObj.action);
    expect(analyticsEventsObj.label).toStrictEqual(returnObj.label);
  });
});

describe('Dataset Detail Helper - generateAnalyticsEvent', () => {
  const eventsSpy = jest.spyOn(Analytics, 'event');
  const analyticsEventsObj: IAnalyticsEvents = new class implements IAnalyticsEvents {
    action: string;
    category: string;
    label: string;
  };

  beforeEach(() => {
    eventsSpy.mockClear();
    analyticsEventsObj.category = analyticsCategory;
    analyticsEventsObj.action = '';
    analyticsEventsObj.label = '';
  });

  it('does not fire an analytics event if invalid params are passed in', () => {
    generateAnalyticsEvent(null, null);
    expect(eventsSpy).not.toHaveBeenCalled();
  });

  it('creates an analytics event with desired fields', () => {
    const label = `Testing label`;
    generateAnalyticsEvent(label);

    analyticsEventsObj.action = `${label} Click`;
    analyticsEventsObj.label = label;
    expect(eventsSpy).toHaveBeenCalledWith(analyticsEventsObj);
    eventsSpy.mockClear();

    const action = 'Unique action string for event';
    generateAnalyticsEvent(label, action);
    analyticsEventsObj.action = action;
    expect(eventsSpy).toHaveBeenCalledWith(analyticsEventsObj);
  });

});
