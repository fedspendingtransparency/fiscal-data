import React from 'react';
import { render } from '@testing-library/react';
import PageNotice from './page-notice';

describe('PageNotice component', () => {

  it('renders its supplied body content', () => {
    const content = 'Mock notice content'
    const { getByTestId } = render(<PageNotice>{content}</PageNotice>);
    expect(getByTestId('pageNoticeContent')).toHaveTextContent(content);
  });
});
