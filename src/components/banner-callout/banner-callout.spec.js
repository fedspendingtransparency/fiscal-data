import React from 'react';
import {render} from '@testing-library/react';
import BannerCallout from './banner-callout';

describe('Banner Callout with link', () => {
    const firstText = "first text";
    const linkText = "link text";
    const secondText = "second text";
    const link = "https://fiscaldata.treasury.gov/"
    const calloutText = firstText + ' **' + linkText + '** ' + secondText;

    it('renders banner with text and link', () => {
        const {getByTestId, getByText} = render(<BannerCallout calloutText={calloutText} calloutURL={link} />);

        expect(getByText(calloutText)).toBeInTheDocument();
        expect(getByTestId('link')).toBeInTheDocument();
    });

    it('renders banner with link embedded in text', () => {
        const {getByTestId} = render(<BannerCallout calloutText={calloutText} calloutURL={link} />);

        expect(getByTestId('link')).toHaveTextContent(linkText);
    });

    it('renders banner without link', () => {
        const {queryByTestId, getByText} = render(<BannerCallout calloutText={firstText} />);

        expect(getByText(firstText)).toBeInTheDocument();
        expect(queryByTestId('link')).not.toBeInTheDocument();
    });

});