import React from 'react';
import {render} from '@testing-library/react';
import BannerCallout from './banner-callout';
import { Link } from "gatsby";

describe('Banner Callout with link', () => {
    const text = "first text";
    const linkText = "link text";
    const link = "https://fiscaldata.treasury.gov/"
    //const testCalloutContent = `${text}<Link to=${link}data-testid='link'>${linkText}</Link>`;

    const testCalloutContent = <p>{text}<Link to={link} data-testid='link'>{linkText}</Link></p>;

    it('renders banner with text and link', () => {
        const {getByTestId, getByText} = render(<BannerCallout calloutContent={testCalloutContent} />);

        expect(getByText(text)).toBeInTheDocument();
        expect(getByText(linkText)).toBeInTheDocument();
        expect(getByTestId('link')).toBeInTheDocument();
    });

    it('renders banner with link embedded in text', () => {
        const {getByTestId} = render(<BannerCallout calloutContent={testCalloutContent} />);

        expect(getByTestId('link')).toHaveTextContent(linkText);
    });

});