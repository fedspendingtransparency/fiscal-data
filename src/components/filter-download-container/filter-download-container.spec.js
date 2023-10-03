import React from 'react';
import FilterAndDownload from './filter-download-container';
import { render } from '@testing-library/react';

jest.mock('../download-wrapper/download-wrapper', () => () => 'DownloadWrapper');
describe('FilterDownloadContainer', () => {
  it('renders the component', () => {
    const { getByTestId } = render(
      <FilterAndDownload dateRange={{ to: new Date(), from: new Date() }} isFiltered={false} selectedTable={null} dataset={{}} />
    );
    expect(getByTestId('filterDownloadContainer')).toBeDefined();
  });
});
