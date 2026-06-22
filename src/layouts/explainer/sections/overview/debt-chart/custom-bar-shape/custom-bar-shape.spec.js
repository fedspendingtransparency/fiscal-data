import React from 'react';
import { render } from '@testing-library/react';
import CustomBarShape from './custom-bar-shape';

describe('Custom bar shape', () => {
  it('renders bar segments', () => {
    const { getAllByTestId } = render(
      <svg>
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
      </svg>
    );
    const segments = getAllByTestId('barSegment');
    expect(segments).toHaveLength(23);
  });

  it('does not render bar segments before the reveal begins', () => {
    const { queryAllByTestId } = render(
      <svg>
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
          revealProgress={0}
        />
      </svg>
    );

    expect(queryAllByTestId('barSegment')).toHaveLength(0);
  });
});
