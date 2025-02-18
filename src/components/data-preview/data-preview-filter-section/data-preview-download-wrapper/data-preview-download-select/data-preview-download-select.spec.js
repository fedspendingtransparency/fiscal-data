import React from 'react';
import { render } from '@testing-library/react';
import DataPreviewDownloadSelect from './data-preview-download-select';
import userEvent from '@testing-library/user-event';

jest.mock('../../../../../variables.module.scss', () => {
  return {
    breakpointLg: '992',
  };
});

describe('Data preview download button', () => {
  it('renders the desktop button default state', () => {
    const { getByRole } = render(<DataPreviewDownloadSelect active={false} setActive={jest.fn()} width={1000} />);
    expect(getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(getByRole('img', { hidden: 'true' })).toHaveAttribute('data-icon', 'caret-down');
  });

  it('renders the mobile button default state', () => {
    const { getByRole } = render(<DataPreviewDownloadSelect active={false} setActive={jest.fn()} width={500} />);
    expect(getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(getByRole('img', { hidden: 'true' })).toHaveAttribute('data-icon', 'caret-right');
  });

  it('renders the desktop button active state', () => {
    const setActiveSpy = jest.fn();
    const { getByRole } = render(<DataPreviewDownloadSelect active={true} setActive={setActiveSpy} width={1000} />);
    const button = getByRole('button', { name: 'Download' });
    userEvent.click(button);
    expect(getByRole('img', { hidden: 'true' })).toHaveAttribute('data-icon', 'caret-up');
    expect(setActiveSpy).toHaveBeenCalledWith(false);
  });

  it('renders the mobile button active state', () => {
    const setActiveSpy = jest.fn();
    const { getByRole } = render(<DataPreviewDownloadSelect active={true} setActive={setActiveSpy} width={500} />);
    const button = getByRole('button', { name: 'Download' });
    userEvent.click(button);
    expect(getByRole('img', { hidden: 'true' })).toHaveAttribute('data-icon', 'cloud-arrow-down');
    expect(setActiveSpy).toHaveBeenCalledWith(false);
  });
});
