import React from 'react';
import DataPreviewColumnFilter from './data-preview-column-filter';
import { render } from '@testing-library/react';

describe('Column Filter', () => {
  it('renders the column filter dropdown', () => {
    const { getByRole } = render(<DataPreviewColumnFilter allTablesSelected={false} isDisabled={false} />);
  });

  it('calls ___ on apply button click', () => {
    const { getByRole } = render(<DataPreviewColumnFilter allTablesSelected={false} isDisabled={false} />);
  });

  it(' does not call ___ on cancel button click', () => {
    const { getByRole } = render(<DataPreviewColumnFilter allTablesSelected={false} isDisabled={false} />);
  });

  it('column check list', () => {
    const { getByRole } = render(<DataPreviewColumnFilter allTablesSelected={false} isDisabled={false} />);
  });
  it('search bar', () => {
    const { getByRole } = render(<DataPreviewColumnFilter allTablesSelected={false} isDisabled={false} />);
  });
});
