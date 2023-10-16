import React from 'react';
import { render } from '@testing-library/react';
import ExperimentalPage from './experimental';

/**
 * This is an experimental page to show off content that cannot be shown elsewhere on the site at the time of development.
 * We should not expect any elaborate unit tests here, and the content of the page should be cleaned out regularly.
 */
describe('Experimental layout page', () => {
  it('launches the component without any issue', () => {
    render(<ExperimentalPage />);
    expect(true).toBe(true);
  });
});
