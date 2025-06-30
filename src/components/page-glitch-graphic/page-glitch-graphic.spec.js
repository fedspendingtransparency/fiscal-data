import React from 'react';
import GlitchGraphic from './page-glitch-graphic';
import { render } from '@testing-library/react';

describe('Not Found Graphic', () => {
  it('renders an image', () => {
    const { getByAltText } = render(<GlitchGraphic />);
    expect(getByAltText('404: Page Not Found')).toBeInTheDocument();
  });
});
