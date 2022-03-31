import React from 'react';
import ReactDOM from 'react-dom';
import Persist, { siteContext, Provider } from './persist';

describe('components.persist', () => {
  let persistedsiteContext;

  beforeEach(() => {
    ReactDOM.render(
      Persist({
        element:
          <Provider>
            <siteContext.Consumer>
              {context => {
                persistedsiteContext = context;
              }}
            </siteContext.Consumer>
          </Provider>
      }), document.createElement('div'));
  });

  it('exposes a getter and setter for persistent search keywords', () => {
    expect(persistedsiteContext.keywords).toBeDefined();
    expect(typeof persistedsiteContext.setKeywords).toBe('function');
  });

  it('exposes a getter and setter for persistent dateRangeTab selection', () => {
    expect(persistedsiteContext.dateRangeTab).toBeDefined();
    expect(typeof persistedsiteContext.setDateRangeTab).toBe('function');
  });

  it('exposes a getter and setter for persistent beginDate selection', () => {
    expect(persistedsiteContext.beginDate).toBeDefined();
    expect(typeof persistedsiteContext.setBeginDate).toBe('function');
  });

  it('exposes a getter and setter for persistent endDate selection', () => {
    expect(persistedsiteContext.endDate).toBeDefined();
    expect(typeof persistedsiteContext.setEndDate).toBe('function');
  });

  it('exposes a getter and setter for persistent exactRange selection', () => {
    expect(persistedsiteContext.exactRange).toBeDefined();
    expect(typeof persistedsiteContext.setExactRange).toBe('function');
  });
});
