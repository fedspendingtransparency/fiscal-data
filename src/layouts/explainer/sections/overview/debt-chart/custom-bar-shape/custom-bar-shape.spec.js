import React from 'react';
import { render } from '@testing-library/react';
import CustomBarShape from './custom-bar-shape';

describe('Custom bar shape', () => {
  it('renders bar segments', () => {
    const { getAllByTestId } = render(
      <CustomBarShape
        height={16}
        width={200}
        y={14}
        x={44.926666902602115}
        payload={{
          debt2022: 19.63560715985077,
          deficit2022: 1.51506707014923,
          year: '2022',
        }}
        dataKey="debt2022"
      />
    );
    const segments = getAllByTestId('barSegment');
    expect(segments).toHaveLength(23);
  });
});
