import React from 'react';
import renderer from 'react-test-renderer';
import SearchField, {lastUpdatedInfoTipAnalyticsObject, searchFieldAnalyticsObject} from "./search-field";
import InfoTip from '../../info-tip/info-tip';
import Analytics from "../../../utils/analytics/analytics";
import { siteContext } from '../../persist/persist';
import {fireEvent, render} from "@testing-library/react";


jest.useFakeTimers();

const testString = 'user typed query';
const persistentTerms = 'my previous query';

describe('Search Field', () => {
  const mockInfoIcon = {
    title: 'Dummy Title',
    body: 'Dummy Body'
  };

  const gaSpy = jest.spyOn(Analytics, 'event');
  let queryTerm, component, instance, button, inputField;
  window.dataLayer = window.dataLayer || [];
  const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

  const mockChangeHandler = (query) => {
    queryTerm = query;
  }

  beforeEach(() => {
    component = renderer.create(
      <SearchField changeHandler={mockChangeHandler} searchTerm="debt program" />
    );

    instance = component.root;
    button = instance.findAllByType('button')[0];
    inputField = instance.findByType('input');
  })

  it('places an input field', () => {
    expect(inputField).toBeDefined();
  });

  it('includes placeholder per design spec', () => {
    expect(inputField.props.placeholder).toBe('Search for Datasets by Keyword...');
  });

  it('calls supplied change handler when text value changes', () => {
    queryTerm = 'something else';

    renderer.act(() => {
      inputField.props.onChange({ target: { value: testString } });
    });

    jest.runAllTimers();

    expect(queryTerm).toBe(testString);
  });

  it(`displays a functional "clear" icon button (with screen-reader accessible label "clear")
    when text is present in the field`,
    () => {
      renderer.act(() => {
        inputField.props.onChange({ target: { value: testString } });
      });

      jest.runAllTimers();

      expect(button.props.disabled).toBeFalsy(); // button is present and not disabled
      expect(button.props['aria-label']).toBe('clear'); // button has screen-reader accessible label

      // test fails if button doesn't contain exactly 1 clear-search icon
      button.findByProps({ 'data-test-id': 'clear-search-icon' });

      // fails if button contains search icon
      const anyWrongIcons = button.findAllByProps({ 'data-test-id': 'search-icon' });
      expect(anyWrongIcons.length).toBe(0);
    }
  );

  it('clears the search when the button is clicked', () => {
    const testString = 'anything';
    queryTerm = testString;

    renderer.act(() => {
      button.props.onClick();
    });

    expect(inputField.props.value).toBe('');
    expect(queryTerm).toBe(''); // search text cleared after button is clicked
  });

  it(
    'displays a search icon within a disabled button when no characters are present in the field',
    () => {
      const staticComponent = renderer.create(
        <SearchField changeHandler={mockChangeHandler} searchTerm="" infoIcon={mockInfoIcon} />
      );
      const inst = staticComponent.root;
      const button = inst.findAllByType('button')[0];
      expect(button.props.disabled).toBeTruthy(); //button is disabled

      // test fails if button doesn't contain exactly 1 search icon
      button.findByProps({ 'data-test-id': 'search-icon' });
      // test fails if button contains clear icon
      const anyWrongIcons = button.findAllByProps({ 'data-test-id': 'clear-search-icon' });
      expect(anyWrongIcons.length).toBe(0);
    }
  );

  it('populates the tooltip', () => {
    const tooltip = instance.findByType(InfoTip);

    expect(tooltip.props.title).toBe('Dataset Keyword Search');
    expect(tooltip.props.children).toBeDefined(); // was content sent to the body?
  });

  it('tracks when a user enters text into the search field and also test GA4 datalayer push', () => {
    const testString = 'Testing123';
    renderer.act(() => {
      inputField.props.onChange({ target: { value: testString } });
    });
    jest.runAllTimers();

    expect(queryTerm).toBe(testString);
    expect(gaSpy).toHaveBeenLastCalledWith({
      ...searchFieldAnalyticsObject,
      label: testString
    });

    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'Keyword Search',
      eventLabel: 'Testing123'
    });
  });
});

describe('search field persistence', () => {
  const mockChangeHandler = jest.fn();
  const setKeywordsSpy = jest.fn();

  let component, instance, inputField;

  beforeEach(() => {
    component = renderer.create(
      <siteContext.Provider
        value={{
          keywords: persistentTerms,
          setKeywords: setKeywordsSpy
        }}
      >
        <SearchField changeHandler={mockChangeHandler} searchTerm="debt program" />
      </siteContext.Provider>
    );

    instance = component.root;
    inputField = instance.findByType('input');
  })

  it('sets previous keywords on page load', () => {
    jest.runAllTimers();
    expect(inputField.props.value).toBe(persistentTerms);
    expect(mockChangeHandler).toHaveBeenCalledWith(persistentTerms);
  })

  it('stores keywords as they are entered', () => {
    renderer.act(() => {
      inputField.props.onChange({ target: { value: testString } });
    });

    jest.runAllTimers();

    expect(setKeywordsSpy).toHaveBeenCalledWith(testString);
  })

  it('Testing GA4 datalayer push for handleInfoTipClick',()=>{
    window.dataLayer = window.dataLayer || [];
    const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

    const{getByTestId} = render(
      <siteContext.Provider
        value={{
          keywords: persistentTerms,
          setKeywords: setKeywordsSpy
        }}
      >
        <SearchField changeHandler={mockChangeHandler} searchTerm="debt program" />
      </siteContext.Provider>
    )

    const infoTip = getByTestId('infoTipButton');

    expect(infoTip).toBeDefined();

    fireEvent.click(infoTip);

    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'Info Button Click',
      eventLabel: 'Keyword Search'
    });
  });
});
