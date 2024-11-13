import React from 'react';
import DataPreview from './data-preview';
import { render } from '@testing-library/react';

describe('data preview', () => {
  it('renders a placeholder', () => {
    const instance = render(<DataPreview></DataPreview>);

    expect(instance).toBeTruthy();
  });
});
