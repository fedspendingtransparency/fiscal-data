import React from 'react';
import { render } from '@testing-library/react';
import { DownloadButton } from './download-button';
import userEvent from '@testing-library/user-event';

describe('Download dialog', () => {
  it('download dialog renders with download options', () => {
    const { getByText } = render(<DownloadButton active={true} setActive={jest.fn()} />);
    expect(getByText('CSV')).toBeInTheDocument();
    expect(getByText('JSON')).toBeInTheDocument();
    expect(getByText('XML')).toBeInTheDocument();
    expect(getByText('Data Dictionary')).toBeInTheDocument();
  });

  it('keyboard interaction', () => {
    const { getByText } = render(<DownloadButton active={true} setActive={jest.fn()} />);
    userEvent.tab(getByText('CSV'));
    userEvent.tab(getByText('JSON'));
  });
});
