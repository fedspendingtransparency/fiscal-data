import React from 'react';
import { render } from '@testing-library/react';
import HomeMainContent from './home-main-content';

describe('Home Main Content', () => {
  it('should render text for h2', () => {
    const { getByTestId } = render(<HomeMainContent />);
    const headerDiv = getByTestId('home-main-content');
    expect(headerDiv).toBeDefined();
  });

  it('should render HomeHighlightCards component', () => {
    const { getByTestId } = render(<HomeMainContent />);
    expect(getByTestId('highlight-cards-parent')).toBeDefined();
  });
});
