import { render } from '@testing-library/react';
import React from 'react';
import DataPreviewDatatableBanner from './data-preview-datatable-banner';

describe('DatatableBanner Component', () => {
  const bannerText = 'THIS IS A TEST';
  it('renders banner with expected notice', async () => {
    const { getByText } = render(<DataPreviewDatatableBanner bannerNotice={bannerText} />);
    expect(getByText(bannerText)).toBeInTheDocument();
  });
});
