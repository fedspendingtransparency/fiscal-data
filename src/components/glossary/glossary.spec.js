import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Glossary from './glossary';
import { testGlossaryData } from './test-helper';
import * as addressPathFunctions from '../../helpers/address-bar/address-bar';
import { GlossaryContext } from './glossary-context/glossary-context';

const triggerClickEvent = itemToClick => {
  fireEvent(
    itemToClick,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );
};

jest.useFakeTimers();

describe('glossary', () => {
  const addressPathMock = jest.spyOn(addressPathFunctions, 'removeAddressPathQuery');
  const setActiveStateMock = jest.fn();
  const mockGlossaryClickHandler = jest.fn();

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '',
        search: '?glossary=apple',
      },
    });
  });

  it('renders the glossary', () => {
    const { getByTestId } = render(
      <GlossaryContext.Provider
        value={{
          glossaryClickEvent: false,
          setGlossaryClickEvent: mockGlossaryClickHandler,
        }}
      >
        <Glossary termList={testGlossaryData} activeState={true} setActiveState={setActiveStateMock} />
      </GlossaryContext.Provider>
    );

    expect(getByTestId('glossaryContainer')).toBeInTheDocument();
  });

  it('contains an overlay div', () => {
    const { getByTestId } = render(
      <GlossaryContext.Provider
        value={{
          glossaryClickEvent: false,
          setGlossaryClickEvent: mockGlossaryClickHandler,
        }}
      >
        <Glossary termList={testGlossaryData} activeState={true} setActiveState={setActiveStateMock} />
      </GlossaryContext.Provider>
    );
    expect(getByTestId('overlay')).toBeDefined();
  });

  it('after the glossary is open, calls to change glossary cative state when overlay is clicked', () => {
    const { getByTestId } = render(
      <GlossaryContext.Provider
        value={{
          glossaryClickEvent: false,
          setGlossaryClickEvent: mockGlossaryClickHandler,
        }}
      >
        <Glossary termList={testGlossaryData} activeState={true} setActiveState={setActiveStateMock} />
      </GlossaryContext.Provider>
    );

    const theOverlay = getByTestId('overlay');
    const theContainer = getByTestId('glossaryContainer');
    expect(theContainer).toHaveClass('open');

    triggerClickEvent(theOverlay);
    expect(setActiveStateMock).toHaveBeenCalledWith(false);
  });

  it('takes a glossary query from the url path and opens that definition', () => {
    const { getByText } = render(
      <GlossaryContext.Provider
        value={{
          glossaryClickEvent: false,
          setGlossaryClickEvent: mockGlossaryClickHandler,
        }}
      >
        <Glossary termList={testGlossaryData} activeState={true} setActiveState={setActiveStateMock} />
      </GlossaryContext.Provider>
    );
    expect(getByText('apple')).toBeInTheDocument();
    expect(getByText('An apple')).toBeInTheDocument();
  });

  it('updates the address path when the glossary definition is opened', () => {
    const { getByText } = render(
      <GlossaryContext.Provider
        value={{
          glossaryClickEvent: false,
          setGlossaryClickEvent: mockGlossaryClickHandler,
        }}
      >
        <Glossary termList={testGlossaryData} activeState={true} setActiveState={setActiveStateMock} />
      </GlossaryContext.Provider>
    );
    expect(getByText('apple')).toBeInTheDocument();
    expect(getByText('An apple')).toBeInTheDocument();
    expect(addressPathMock).toHaveBeenCalledWith(window.location);
  });

  it('updates the address path when a glossary event is called', () => {
    const { getByText } = render(
      <GlossaryContext.Provider
        value={{
          glossaryClickEvent: true,
          setGlossaryClickEvent: mockGlossaryClickHandler,
        }}
      >
        <Glossary termList={testGlossaryData} activeState={true} setActiveState={setActiveStateMock} />
      </GlossaryContext.Provider>
    );
    jest.runAllTimers();
    expect(getByText('apple')).toBeInTheDocument();
    expect(getByText('An apple')).toBeInTheDocument();
    expect(addressPathMock).toHaveBeenCalledWith(window.location);
  });
});
