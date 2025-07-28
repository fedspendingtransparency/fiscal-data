import React, { act } from 'react';
import Accordion from './accordion';
import { open } from './accordion.module.scss';
import { fireEvent, render } from '@testing-library/react';

describe('Accordion', () => {
  const titleText = 'Placeholder Title';
  const bodyText = 'Placeholder Body';

  it('expects the title to be rendered.', () => {
    const { getByTestId } = render(<Accordion title={titleText}>{bodyText}</Accordion>);
    expect(getByTestId('heading')).toHaveTextContent(titleText);
  });

  it('expects the .sr-only class to exist with screen reader assistance text.', () => {
    const { getByTestId } = render(<Accordion title={titleText}>{bodyText}</Accordion>);
    expect(getByTestId('sr-desc')).toHaveClass('sr-only');
  });

  it('expects the body content to be rendered.', () => {
    const { getByTestId } = render(<Accordion title={titleText}>{bodyText}</Accordion>);
    act(() => {
      fireEvent.click(getByTestId('heading'));
    });
    expect(getByTestId('content')).toHaveTextContent(bodyText);
  });

  it('expects the accordion to toggle the "open" class when the heading is clicked', async () => {
    const { findByTestId } = render(<Accordion title={titleText}>{bodyText}</Accordion>);
    const accordion = await findByTestId('section');
    expect(accordion).not.toHaveClass(open);
    const heading = await findByTestId('heading');
    act(() => {
      heading.click();
    });
    expect(accordion).toHaveClass(open);
  });
});
