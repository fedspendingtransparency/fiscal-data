import { fireEvent, render, within } from '@testing-library/react';
import { act } from 'react-test-renderer';
import React from 'react';
import SearchBar from './search-bar';


describe('', () => {
  const changeHandlerSpy = jest.fn();
  const clearHandlerSpy = jest.fn();
  const setActiveSpy = jest.fn();

  it('renders a search bar', () => {
    const { getByRole } = render(
      <SearchBar label={'Test Label'}
                 onChange={changeHandlerSpy}
                 filter={'test'}
                 width={200}
                 handleClear={clearHandlerSpy}
                 active={false}
                 setActive={setActiveSpy}
      />);

    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('calls the filter handler when text is added in the search bar', () => {
    const { getByRole } = render(
      <SearchBar label={'Test Label'}
                 onChange={changeHandlerSpy}
                 filter={''}
                 width={200}
                 handleClear={clearHandlerSpy}
                 active={false}
                 setActive={setActiveSpy}
      />);

    const searchBar = getByRole('textbox');

    act(() => {
      fireEvent.change(searchBar, {target: {value: 'test'}});
    })
    expect(changeHandlerSpy).toHaveBeenCalled();
  });

  it('renders a clear button when text is entered', () => {
    const { getByRole } = render(
      <SearchBar label={'Test Label'}
                 onChange={changeHandlerSpy}
                 filter={'test'}
                 width={200}
                 handleClear={clearHandlerSpy}
                 active={false}
                 setActive={setActiveSpy}
      />);

    const clearButton = getByRole('button', {hidden: true});
    expect(clearButton).toHaveClass('fa-circle-xmark');
    fireEvent.click(clearButton);
    expect(clearHandlerSpy).toHaveBeenCalled();
  })

  it('sets search bar as active on click and not active on blur', () => {
    const { getByRole } = render(
      <SearchBar label={'Test Label'}
                 onChange={changeHandlerSpy}
                 filter={'test'}
                 width={200}
                 handleClear={clearHandlerSpy}
                 active={false}
                 setActive={setActiveSpy}
      />);

    const searchBar = getByRole('textbox');

    fireEvent.click(searchBar);
    expect(setActiveSpy).toHaveBeenCalledWith(true);

    fireEvent.blur(searchBar);
    expect(setActiveSpy).toHaveBeenCalledWith(false);
  })
})
