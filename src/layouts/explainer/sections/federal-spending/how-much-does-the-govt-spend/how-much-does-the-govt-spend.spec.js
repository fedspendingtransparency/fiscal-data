import HowMuchDoesTheGovtSpend from './how-much-does-the-govt-spend';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import fetchMock from 'fetch-mock';
import { getShortForm } from '../../../../../utils/rounding-utils';
import { mockAgencyData, mockAgencyEndpoint, mockCategoryData, mockCategoryEndpoint, mockNegative } from './test-helper';

describe('Federal spending explainer page sections', () => {
  describe('Standard Category Data', () => {
    beforeAll(() => {
      fetchMock
        .mockGlobal()
        .route(mockCategoryEndpoint, mockCategoryData)
        .route(mockAgencyEndpoint, mockAgencyData);
    });

    afterAll(() => {
      fetchMock.hardReset();
    });

    it('renders', () => {
      const instance = render(<HowMuchDoesTheGovtSpend />);
      expect(instance).toBeTruthy();
    });

    it('has the right sections, toggle view', async () => {
      const { getByText, getByTestId } = render(<HowMuchDoesTheGovtSpend />);
      await waitFor(() => {
        expect(getByTestId('toggle-button-agency')).toBeInTheDocument();
        expect(getByTestId('toggle-button-category')).toBeInTheDocument();
        fireEvent.click(getByTestId('toggle-button-agency'));
        expect(getByText('Social Security Administration')).toBeInTheDocument();
        fireEvent.click(getByTestId('toggle-button-category'));
        expect(getByText('Social Security')).toBeInTheDocument();
      });
      expect(getByText('U.S. Government Spending, FYTD 2022')).toBeDefined();
      expect(getByText('Top 10 Spending by Category and Agency')).toBeDefined();
    });

    it('renders the mobile chart', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 360,
      });

      window.dispatchEvent(new Event('resize'));

      const { getByText, getByTestId } = render(<HowMuchDoesTheGovtSpend />);

      await waitFor(() => {
        expect(getByTestId('toggle-button-agency')).toBeInTheDocument();
        expect(getByTestId('toggle-button-category')).toBeInTheDocument();
        fireEvent.click(getByTestId('toggle-button-agency'));
        expect(getByText('Social Security Administration')).toBeInTheDocument();
        fireEvent.click(getByTestId('toggle-button-category'));
        expect(getByText('Social Security')).toBeInTheDocument();
      });
    });

    it('dollar / percent toggle renders and is functional', async () => {
      const { getByText, getByTestId } = render(<HowMuchDoesTheGovtSpend />);
      await waitFor(() => {
        expect(getByText('Dollars')).toBeInTheDocument();
        expect(getByTestId('switch')).toBeInTheDocument();
      });
      fireEvent.click(getByTestId('switch'));
      expect(getByText('$1.22 T')).toBeInTheDocument();
      fireEvent.click(getByTestId('switch'));
      expect(getByText('19 %')).toBeInTheDocument();
    });
  });

  describe('Negative Category Data', () => {
    beforeAll(() => {
      fetchMock
        .mockGlobal()
        .route(mockCategoryEndpoint, mockNegative)
        .route(mockAgencyEndpoint, mockAgencyData);
    });

    afterAll(() => {
      fetchMock.hardReset();
    });

    it('formats the Other dollars value using formatDollars showing negative values', async () => {
      const { getByTestId, getByText } = render(<HowMuchDoesTheGovtSpend />);
      await waitFor(() => {
        expect(getByTestId('switch')).toBeInTheDocument();
      });
      fireEvent.click(getByTestId('switch'));
      expect(getByText('Other')).toBeInTheDocument();
      const otherTotal = -72090892981 + -100000000000;
      expect(getByText(`-$${getShortForm(Math.abs(otherTotal))}`)).toBeInTheDocument();
    });
  });
});
