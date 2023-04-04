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

    it('renders banner for specified dataset', () => {
        const {queryByTestId, queryByText} = render(<BannerCallout bannerCallout={fakeCalloutFlag} />);

        expect(queryByTestId('banner')).not.toBeInTheDocument();
        expect(queryByTestId('internal-link')).not.toBeInTheDocument();
        expect(queryByText(/calculate foreign currency exchange rates/)).not.toBeInTheDocument();
    });
});


