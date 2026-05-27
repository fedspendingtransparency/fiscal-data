import { fireEvent, render, waitFor } from '@testing-library/react';
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
    window.history.pushState({}, 'Test Title', '/?glossary=apple');
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

  it('after the glossary is open, calls to change glossary active state when overlay is clicked', () => {
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

  it('returns focus to the glossaryTriggerEl when user tabs past the last element in the overlay', async () => {
    const mockTriggerElement = document.createElement('button');
    mockTriggerElement.focus = jest.fn();
    document.body.appendChild(mockTriggerElement);

    const { getByTestId } = render(
      <GlossaryContext.Provider
        value={{
          glossaryClickEvent: false,
          setGlossaryClickEvent: mockGlossaryClickHandler,
          glossaryTriggerEl: mockTriggerElement,
          setGlossaryTriggerEl: jest.fn(),
        }}
      >
        <Glossary termList={testGlossaryData} activeState={true} setActiveState={setActiveStateMock} />
      </GlossaryContext.Provider>
    );

    const container = getByTestId('glossaryContainer');
    const focusableElements = container.querySelectorAll('button, a[href]');
    const lastElement = focusableElements[focusableElements.length - 1];

    // find the last element and simulate the user pressing 'tab'
    lastElement.focus();
    const glossaryOverlay = getByTestId('glossary-tray');
    fireEvent.keyDown(glossaryOverlay, {
      key: 'Tab',
    });
    await waitFor(() => {
      expect(mockTriggerElement.focus).toHaveBeenCalled();
    });
  });
});
