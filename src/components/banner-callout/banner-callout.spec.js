import React from 'react';
import {render} from '@testing-library/react';
import BannerCallout from './banner-callout';

describe('Banner Callout with flag', () => {
    const currentDate = new Date().toLocaleDateString();
    const currentYear = Number(currentDate.substring(currentDate.length - 4));
    const beforeCurrentDate = "1/1/" + (currentYear - 1); 
    const afterCurrentDate = "1/1/" + (currentYear + 1); 
    const currentBanner = 'XRCallout';
    const currentCallout = {
      banner: currentBanner
    };
    const fakeCallout = {
      banner: 'NotACallout'
    };

    it('renders banner for specified dataset', () => {
        const {getByTestId, getByText} = render(<BannerCallout bannerCallout={currentCallout} />);

        expect(getByTestId('internal-link')).toBeInTheDocument();
        expect(getByText(/calculate foreign currency exchange rates/)).toBeInTheDocument();
    });

    it('does not render banner for a dataset with no copy configured', () => {
        const {queryByTestId, queryByText} = render(<BannerCallout bannerCallout={fakeCallout.banner} />);

        expect(queryByTestId('banner')).not.toBeInTheDocument();
        expect(queryByTestId('internal-link')).not.toBeInTheDocument();
        expect(queryByText(/calculate foreign currency exchange rates/)).not.toBeInTheDocument();
    });

    it('renders the info banner by default', () => {
      const {getByTestId, getByRole} = render(<BannerCallout bannerCallout={currentCallout} />);
      expect(getByRole('img', {hidden: true})).toHaveClass('fa-circle-info');
      expect(getByTestId('banner')).toHaveClass('infoBanner');
    })

    it('renders the warning banner when specified and no dates are passed in', () => {
      const {getByTestId, getByRole} = render(
        <BannerCallout bannerCallout={currentCallout} bannerType="warning" />
      );
      expect(getByRole('img', {hidden: true})).toHaveClass('fa-triangle-exclamation');
      expect(getByTestId('banner')).toHaveClass('warningBanner');
    })

    it('renders the warning banner when specified and between beginning and end dates', () => {
      const dateCallout = {
        banner: currentBanner,
        startDate: beforeCurrentDate,
        endDate: afterCurrentDate
      }
      const {getByTestId, getByRole} = render(
        <BannerCallout bannerCallout={dateCallout} bannerType="warning" />
      );
      expect(getByRole('img', {hidden: true})).toHaveClass('fa-triangle-exclamation');
      expect(getByTestId('banner')).toHaveClass('warningBanner');
    })

    it('renders the warning banner when specified and before end display date', () => {
      const dateCallout = {
        banner: currentBanner,
        endDate: afterCurrentDate
      }
      const {getByTestId, getByRole} = render(
        <BannerCallout bannerCallout={dateCallout} bannerType="warning" />
      );
      expect(getByRole('img', {hidden: true})).toHaveClass('fa-triangle-exclamation');
      expect(getByTestId('banner')).toHaveClass('warningBanner');
    })

    it('renders the warning banner when specified and after begin display date', () => {
      const dateCallout = {
        banner: currentBanner,
        startDate: beforeCurrentDate
      }
      const {getByTestId, getByRole} = render(
        <BannerCallout bannerCallout={dateCallout} bannerType="warning" />
      );
      expect(getByRole('img', {hidden: true})).toHaveClass('fa-triangle-exclamation');
      expect(getByTestId('banner')).toHaveClass('warningBanner');
    })

    it('does not render the warning banner when current date is outside of display dates', () => {
      const dateCallout = {
        banner: currentBanner,
        startDate: beforeCurrentDate,
        endDate: beforeCurrentDate
      }
      const {queryByTestId, queryByText} = render(
        <BannerCallout bannerCallout={dateCallout} bannerType="warning" />
      );
      expect(queryByTestId('banner')).not.toBeInTheDocument();
      expect(queryByTestId('internal-link')).not.toBeInTheDocument();
      expect(queryByText(/calculate foreign currency exchange rates/)).not.toBeInTheDocument();
    })

    it('does not render the warning banner when end date is the current date', () => {
      const dateCallout = {
        banner: currentBanner,
        startDate: beforeCurrentDate,
        endDate: currentDate
      }
      const {queryByTestId, queryByText} = render(
        <BannerCallout bannerCallout={dateCallout} bannerType="warning" />
      );
      expect(queryByTestId('banner')).not.toBeInTheDocument();
      expect(queryByTestId('internal-link')).not.toBeInTheDocument();
      expect(queryByText(/calculate foreign currency exchange rates/)).not.toBeInTheDocument();
    })

    it('renders the warning banner when begin date is the current date', () => {
      const dateCallout = {
        banner: currentBanner,
        startDate: currentDate,
        endDate: afterCurrentDate
      }
      const {getByTestId, getByRole} = render(
        <BannerCallout bannerCallout={dateCallout} bannerType="warning" />
      );
      expect(getByRole('img', {hidden: true})).toHaveClass('fa-triangle-exclamation');
      expect(getByTestId('banner')).toHaveClass('warningBanner');
    })
});


