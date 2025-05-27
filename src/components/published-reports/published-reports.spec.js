import PublishedReports from './published-reports';
import { render } from '@testing-library/react';
import React from 'react';
import { mockReports } from './published-reports-test-helper';

describe('Published Reports', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  it('should display standard report section', () => {
    const { getByRole } = render(<PublishedReports pageConfig={{ publishedReports: mockReports, reportGenKey: null }} />);
    expect(getByRole('table')).toBeInTheDocument();
  });

  // TODO: Uncomment test when generative report section is no longer experimental
  // it('should display generative report section', () => {
  //   const { getByRole, getByText } = render(
  //       <PublishedReports pageConfig={mockDataset} />
  //   );
  //   expect(getByRole('table')).toBeInTheDocument();
  //   expect(getByText('This table requires additional filters.')).toBeInTheDocument();
  // });
});
