import React from 'react';
import { render } from '@testing-library/react';
import DataPreviewDropdownDialog from './data-preview-dropdown-dialog';

describe('Data Preview Dropdown Dialog', () => {
  it('renders the dropdown', () => {
    const instance = render(<DataPreviewDropdownDialog />);
    expect(instance).toBeDefined();
  });
});
