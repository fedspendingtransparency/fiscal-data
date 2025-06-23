import React, { act } from 'react';
import SearchField, { searchFieldAnalyticsObject } from './search-field';
import Analytics from '../../../utils/analytics/analytics';
import { siteContext } from '../../persist/persist';
import { fireEvent, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.useFakeTimers();

const testString = 'user typed query';
const persistentTerms = 'my previous query';

describe('Search Field', () => {
  const gaSpy = jest.spyOn(Analytics, 'event');
  let queryTerm;
  window.dataLayer = window.dataLayer || [];
  const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

  const mockChangeHandler = query => {
    queryTerm = query;
  };

  it('places an input field', () => {
    const { getByRole } = render(<SearchField changeHandler={mockChangeHandler} searchTerm="debt program" />);
    expect(getByRole('textbox')).toBeDefined();
  });

  it('includes placeholder per design spec', () => {
    const { getByRole } = render(<SearchField changeHandler={mockChangeHandler} searchTerm="debt program" />);
    const inputField = getByRole('textbox');
    expect(inputField).toHaveAttribute('placeholder', 'Search for Datasets by Keyword...');
  });

  it('calls supplied change handler when text value changes', () => {
    queryTerm = 'something else';
    const { getByRole } = render(<SearchField changeHandler={mockChangeHandler} searchTerm="debt program" />);
    const inputField = getByRole('textbox');

    act(() => {
      userEvent.click(inputField);
      userEvent.keyboard(testString);
    });

    jest.runAllTimers();

    expect(queryTerm).toBe(testString);
  });

  it(`displays a functional "clear" icon button (with screen-reader accessible label "clear")
    when text is present in the field`, () => {
    const { getByRole, getByTestId, queryByTestId } = render(<SearchField changeHandler={mockChangeHandler} searchTerm="debt program" />);
    const inputField = getByRole('textbox');

    act(() => {
      userEvent.click(inputField);
      userEvent.keyboard(testString);
      jest.runAllTimers();
    });

    const button = getByRole('button', { name: 'clear' });
    expect(button).not.toBeDisabled(); // button is present and not disabled
    expect(getByTestId('clear-search-icon')).toBeInTheDocument();
    expect(queryByTestId('search-icon')).not.toBeInTheDocument();
  });

  it('clears the search when the button is clicked', () => {
    const testString = 'anything';
    queryTerm = testString;
    const { getByRole } = render(<SearchField changeHandler={mockChangeHandler} searchTerm="debt program" />);
    const button = getByRole('button');
    const inputField = getByRole('textbox');

    act(() => {
      fireEvent.click(button);
      jest.runAllTimers();
    });

    expect(inputField).toHaveValue('');
    expect(queryTerm).toBe(''); // search text cleared after button is clicked
  });

  it('displays a search icon within a disabled button when no characters are present in the field', () => {
    const { getByTestId } = render(<SearchField changeHandler={mockChangeHandler} searchTerm={''} />);
    const button = getByTestId('search-button');
    expect(button).toBeDisabled();

    // test fails if button doesn't contain exactly 1 search icon
    expect(within(button).getByTestId('search-icon')).toBeInTheDocument();
    // test fails if button contains clear icon
    expect(within(button).queryByTestId('clear-search-icon')).not.toBeInTheDocument();
  });

  it('populates the tooltip', () => {
    const { getByRole } = render(<SearchField changeHandler={mockChangeHandler} searchTerm="debt program" />);

    const tooltip = getByRole('button', { name: 'More information about Dataset Keyword Search.' });
    expect(tooltip).toBeInTheDocument();
  });

  it('tracks when a user enters text into the search field and also test GA4 datalayer push', () => {
    const testString = 'Testing123';
    const { getByRole } = render(<SearchField changeHandler={mockChangeHandler} searchTerm="debt program" />);
    const input = getByRole('textbox');
    userEvent.click(input);
    userEvent.keyboard(testString);
    jest.runAllTimers();

    expect(queryTerm).toBe(testString);
    expect(gaSpy).toHaveBeenLastCalledWith({
      ...searchFieldAnalyticsObject,
      label: testString,
    });

    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'Keyword Search',
      eventLabel: 'Testing123',
    });
  });
});

describe('search field persistence', () => {
  const mockChangeHandler = jest.fn();
  const setKeywordsSpy = jest.fn();

  it('sets previous keywords on page load', () => {
    const { getByRole } = render(
      <siteContext.Provider
        value={{
          keywords: persistentTerms,
          setKeywords: setKeywordsSpy,
        }}
      >
        <SearchField changeHandler={mockChangeHandler} searchTerm="debt program" />
      </siteContext.Provider>
    );
    const inputField = getByRole('textbox');

    jest.runAllTimers();
    expect(inputField).toHaveValue(persistentTerms);
    expect(mockChangeHandler).toHaveBeenCalledWith(persistentTerms);
  });

  it('stores keywords as they are entered', () => {
    const { getByRole } = render(
      <siteContext.Provider
        value={{
          keywords: persistentTerms,
          setKeywords: setKeywordsSpy,
        }}
      >
        <SearchField changeHandler={mockChangeHandler} searchTerm="debt program" />
      </siteContext.Provider>
    );
    const inputField = getByRole('textbox');
    userEvent.click(inputField);
    userEvent.keyboard(testString);
    jest.runAllTimers();

    expect(setKeywordsSpy).toHaveBeenCalledWith(persistentTerms + testString);
  });

  it('Testing GA4 datalayer push for handleInfoTipClick', () => {
    window.dataLayer = window.dataLayer || [];
    const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

    const { getByTestId } = render(
      <siteContext.Provider
        value={{
          keywords: persistentTerms,
          setKeywords: setKeywordsSpy,
        }}
      >
        <SearchField changeHandler={mockChangeHandler} searchTerm="debt program" />
      </siteContext.Provider>
    );

    const infoTip = getByTestId('infoTipButton');

    expect(infoTip).toBeDefined();

    fireEvent.click(infoTip);

    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'Info Button Click',
      eventLabel: 'Keyword Search',
    });
  });
});
