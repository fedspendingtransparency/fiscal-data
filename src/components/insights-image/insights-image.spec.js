import React from 'react';
import {render} from '@testing-library/react';
import InsightsImage from "./insights-image";

describe('Insights Image', () => {



  it('renders the image on normal (desktop) screen width', () => {

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    window.dispatchEvent(new Event('resize'));

    const { getByTestId } = render(<InsightsImage imageRefDesktop={'example'} imageRefMobile={'exampleMobile'} altText={'example alt text'} />);
    expect(getByTestId('Image')).toBeInTheDocument();
  });

  it('renders the image on smaller (mobile) screen width', () => {

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 360,
    });

    window.dispatchEvent(new Event('resize'));

    const { getByTestId } = render(<InsightsImage imageRefDesktop={'example'} imageRefMobile={'exampleMobile'} altText={'example alt text'} />);
    expect(getByTestId('Image')).toBeInTheDocument();
  });
});
