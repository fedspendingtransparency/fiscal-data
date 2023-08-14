import React from 'react';
import {render} from '@testing-library/react';
import BannerCallout from './banner-callout';

describe('Banner Callout with flag', () => {
    const calloutFlag = 'XRCallout';
    const fakeCalloutFlag = 'NotACallout';

    it('renders banner for specified dataset', () => {
        const {getByTestId, getByText} = render(<BannerCallout bannerCallout={calloutFlag} />);

        expect(getByTestId('internal-link')).toBeInTheDocument();
        expect(getByText(/calculate foreign currency exchange rates/)).toBeInTheDocument();
    });

    it('does not render banner for a dataset with no copy configured', () => {
        const {queryByTestId, queryByText} = render(<BannerCallout bannerCallout={fakeCalloutFlag} />);

        expect(queryByTestId('banner')).not.toBeInTheDocument();
        expect(queryByTestId('internal-link')).not.toBeInTheDocument();
        expect(queryByText(/calculate foreign currency exchange rates/)).not.toBeInTheDocument();
    });

    it('renders the info banner by default', () => {
      const {getByTestId, getByRole} = render(<BannerCallout bannerCallout={calloutFlag} />);
      expect(getByRole('img', {hidden: true})).toHaveClass('fa-circle-info');
      expect(getByTestId('banner')).toHaveClass('warning-banner');
    })
});


