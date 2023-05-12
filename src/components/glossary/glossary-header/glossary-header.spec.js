import { render, within } from '@testing-library/react';
import GlossaryHeader from './glossary-header';
import React from 'react';
describe('glossary header',() => {
  it('renders a x button', () => {
    const clickHandlerSpy = jest.fn();
    const { getByRole } = render(<GlossaryHeader clickHandler={clickHandlerSpy} />);

    const closeButton = getByRole('button');
    expect(within(closeButton).getByRole('img', {hidden: true})).toHaveClass('fa-xmark');


  });

  it('calls the click handler when the close button is clicked', () => {
    const clickHandlerSpy = jest.fn();
    const { getByRole } = render(<GlossaryHeader clickHandler={clickHandlerSpy} />);

    const closeButton = getByRole('button');
    closeButton.click();
    expect(clickHandlerSpy).toHaveBeenCalled();
  })
});
