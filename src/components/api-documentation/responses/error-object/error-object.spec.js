import React from 'react';
import { render } from '@testing-library/react';
import ErrorObject from './error-object';

describe('Error Object', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findByTestId } = render(<ErrorObject />);
    const sectionContent = await findByTestId('section-content');
    expect(sectionContent).toBeInTheDocument();
  });

  it('creates the Error Object section with the desired id, heading tag and title', async () => {
    const title = 'Error Object';
    const { findByRole } = render(<ErrorObject />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
});
