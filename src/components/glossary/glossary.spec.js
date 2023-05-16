import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Glossary from './glossary';
import { testGlossaryData } from './test-helper';
import * as addressPathFunctions from '../../helpers/address-bar/address-bar';

const triggerClickEvent = (itemToClick) => {
  fireEvent(itemToClick, new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  }));
};


describe('glossary',() => {
  const addressPathMock = jest.spyOn(addressPathFunctions, 'removeAddressPathQuery');
  const setActiveStateMock = jest.fn();

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '',
        search: '?glossary=apple',
      }
    })
  });


  it('renders the glossary', () => {
    const { getByTestId } = render(<Glossary termList={testGlossaryData} 
                                             activeState={true} />);

    expect(getByTestId('glossaryContainer')).toBeInTheDocument();
  });

  it('contains an overlay div', () => {
    const { getByTestId } = render(<Glossary termList={testGlossaryData} 
                                             activeState={true} />);
    expect(getByTestId('overlay')).toBeDefined();
  });

  it('after the glossary is open, calls to change glossary cative state when overlay is clicked', () => {
    const { getByTestId } = render(<Glossary 
                termList={testGlossaryData} 
                activeState={true}
                setActiveState={setActiveStateMock}/>);


    const theOverlay = getByTestId('overlay');
    const theContainer = getByTestId('glossaryContainer');
    expect(theContainer).toHaveClass('open');

    triggerClickEvent(theOverlay);
    expect(setActiveStateMock).toHaveBeenCalledWith(false);
  });

  it('takes a glossary query from the url path and opens that definition', () => {
    const {  getByText } = render(<Glossary termList={testGlossaryData}
                                            activeState={true} />);

    expect(getByText('apple')).toBeInTheDocument();
    expect(getByText('An apple')).toBeInTheDocument();
  })

  it('updates the address path when the glossary definition is opened', () => {
    const { getByText } = render(<Glossary termList={testGlossaryData} 
                                           activeState={true} />);

    expect(getByText('apple')).toBeInTheDocument();
    expect(getByText('An apple')).toBeInTheDocument();
    expect(addressPathMock).toHaveBeenCalledWith(window.location)
  })
});
