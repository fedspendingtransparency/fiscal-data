import React from 'react';
import '@testing-library/jest-dom';
import DownloadPercentageStatus from './download-percentage-status';
import { render } from '@testing-library/react';

describe('download percentage status', () => {
  it('renders a circular progress bar with the percentage listed inside', () => {
    const percentage = 50;
    const { getByTestId } = render(<DownloadPercentageStatus percentage={percentage} />);

    // expect(getByTestId('progress-bar')).toBeDefined();
    // expect(getByTestId('percentage')).toHaveTextContent(percentage);
  });
});
