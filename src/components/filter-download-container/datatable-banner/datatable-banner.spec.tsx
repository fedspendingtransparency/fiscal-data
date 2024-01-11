import { render } from '@testing-library/react';
import React from 'react';
import DatatableBanner from './datatable-banner';

describe('DatatableBanner Component', () => {
  const bannerText = 'THIS IS A TEST';
  it('renders banner with expected notice', async () => {
    const { getByTestId } = render(<DatatableBanner bannerNotice={bannerText} />);
    expect(getByTestId('datatable-banner')).toHaveTextContent(bannerText);
  });
});
