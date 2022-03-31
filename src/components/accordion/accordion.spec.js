import React from 'react';
import Accordion from './accordion';
import * as styles from './accordion.module.scss';
import { render } from '@testing-library/react';

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
    expect(getByTestId('content')).toHaveTextContent(bodyText);
  });

  it('expects the accordion to toggle the "open" class when the heading is clicked', async() => {
    const { getByTestId } = render(<Accordion title={titleText}>{bodyText}</Accordion>);
    const accordion = getByTestId('section');
    expect(accordion).not.toHaveClass(styles.open);
    getByTestId('heading').click();
    expect(accordion).toHaveClass(styles.open);
  });
});
