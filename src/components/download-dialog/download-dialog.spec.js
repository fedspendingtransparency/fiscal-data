import React from 'react';
import { render } from '@testing-library/react';
import { DownloadDialog } from './download-dialog';

describe('Download dialog', () => {
  it('download dialog renders with download options', () => {
    const { getByText } = render(<DownloadDialog />);
    expect(getByText('CSV')).toBeInTheDocument();
    expect(getByText('JSON')).toBeInTheDocument();
    expect(getByText('XML')).toBeInTheDocument();
    expect(getByText('Data Dictionary')).toBeInTheDocument();
  });
});
