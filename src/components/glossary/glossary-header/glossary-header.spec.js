import { fireEvent, render, within } from '@testing-library/react';
import GlossaryHeader from './glossary-header';
import React from 'react';
import { act } from 'react-test-renderer';
describe('glossary header',() => {
    const clickHandlerSpy = jest.fn();
    const mockFilterHandler = jest.fn();

  it('renders a x button', () => {
    const { getByRole } = render(<GlossaryHeader clickHandler={clickHandlerSpy} filter={''} filterHandler={mockFilterHandler} />);

    const closeButton = getByRole('button');
    expect(within(closeButton).getByRole('img', {hidden: true})).toHaveClass('fa-xmark');


  });

  it('calls the click handler when the close button is clicked', () => {
    const { getByRole } = render(<GlossaryHeader clickHandler={clickHandlerSpy} filter={''} filterHandler={mockFilterHandler} />);

    const closeButton = getByRole('button');
    closeButton.click();
    expect(clickHandlerSpy).toHaveBeenCalled();
  });

  it('renders a search bar', () => {
    const { getByRole } = render(<GlossaryHeader clickHandler={clickHandlerSpy} filter={''} filterHandler={mockFilterHandler} />);

    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('calls the filter handler when text is added in the search bar', () => {
    const { getByRole } = render(<GlossaryHeader clickHandler={clickHandlerSpy} filter={''} filterHandler={mockFilterHandler} />);
    const searchBar = getByRole('textbox');

    act(() => {
      fireEvent.change(searchBar, {target: {value: 'test'}});
    })

    expect(mockFilterHandler).toHaveBeenCalledWith('test');
  });
});
