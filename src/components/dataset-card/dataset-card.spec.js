import React from 'react';
import Analytics from '../../utils/analytics/analytics';
import DatasetCard from './dataset-card';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('react-device-detect', () => ({
  isFirefox: false,
}));

describe('DatasetCard', () => {
  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();

  const mockConfig = {
    apis: [
      {
        dateField: 'data_date',
        endpoint: 'accounting/od/debt_to_penny',
        fields: null,
        dimension: null,
        filter: null,
      },
    ],
    name: 'Debt to the Penny',
    popular: true,
    dataStartYear: 2005,
    tagLine: 'test tag line',
    slug: '/debt-to-the-penny/',
    summaryText: 'Debt to the Penny summary text',
    tags: ['Debt', 'MVP'],
    techSpecs: {
      lastUpdated: '12/19/2019',
      fileFormat: null,
    },
  };

  const context = 'Related Dataset';
  const referrer = 'Referring Dataset';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('entire card, when clicked, links to relevant dataset detail page', () => {
    const { getByRole } = render(<DatasetCard dataset={mockConfig} context={context} referrer={referrer} />);
    const thisCard = getByRole('link');
    expect(thisCard).toHaveAttribute('href', `/datasets${mockConfig.slug}`);
  });

  it('contains the dataset name', () => {
    const { getByText } = render(<DatasetCard dataset={mockConfig} context={context} referrer={referrer} />);
    expect(getByText('Debt to the Penny')).toBeDefined();
  });

  it('tracks when dataset card is click', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByRole } = render(<DatasetCard dataset={mockConfig} context={context} referrer={referrer} />);

    const thisCard = getByRole('link');
    userEvent.click(thisCard);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      category: `${context} Click`,
      action: `Related Dataset Click`,
      label: mockConfig.name,
    });
  });

  it('tracks when dataset card is clicked from explainer page', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText } = render(<DatasetCard dataset={mockConfig} context={'Related Datasets'} referrer={'Spending'} explainer={true} />);
    const datasetCard = getByText('Debt to the Penny');

    datasetCard.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'Spending Citation Click',
      label: 'Debt to the Penny',
    });
    spy.mockClear();
  });

  it('Pushes analytics event to datalayer for GA4 for dataset card - explainer', async () => {
    const { getByText } = render(<DatasetCard dataset={mockConfig} context={'Related Datasets'} referrer={'Spending'} explainer={true} />);

    const datasetCard = getByText('Debt to the Penny');
    window.dataLayer = window.dataLayer || [];
    const spy = jest.spyOn(window.dataLayer, 'push');

    fireEvent.click(datasetCard);
    expect(spy).toHaveBeenCalledWith({
      event: 'Spending - Citation Click',
      citationClickEventLabel: 'Debt to the Penny',
    });
    spy.mockClear();
  });

  it('Pushes analytics event to datalayer for GA4 for dataset card - non explainer', async () => {
    const { getByText } = render(<DatasetCard dataset={mockConfig} context={'Related Datasets'} referrer={'example'} explainer={false} />);

    const datasetCard = getByText('Debt to the Penny');
    window.dataLayer = window.dataLayer || [];
    const spy = jest.spyOn(window.dataLayer, 'push');

    fireEvent.click(datasetCard);
    expect(spy).toHaveBeenCalledWith({
      event: 'Related Datasets Click',
      eventLabel: 'from example to Debt to the Penny',
    });
    spy.mockClear();
  });

  describe('Dataset Search Page context', () => {
    it('tracks analytics with Dataset Search Page context', () => {
      const spy = jest.spyOn(Analytics, 'event');
      const { getByRole } = render(<DatasetCard dataset={mockConfig} context="Dataset Search Page" referrer="Search Results" />);
      const thisCard = getByRole('link');

      fireEvent.click(thisCard);
      expect(spy).toHaveBeenCalledWith({
        category: 'Dataset Search Page',
        action: 'Dataset Search Page Click',
        label: mockConfig.name,
      });
    });

    it('pushes GA4 event for Dataset Search Page context', () => {
      window.dataLayer = window.dataLayer || [];
      const spy = jest.spyOn(window.dataLayer, 'push');
      const { getByRole } = render(<DatasetCard dataset={mockConfig} context="Dataset Search Page" referrer="Search Results" />);
      const thisCard = getByRole('link');

      fireEvent.click(thisCard);
      expect(spy).toHaveBeenCalledWith({
        event: 'Dataset Search Page Click',
        eventLabel: 'from Search Results to Debt to the Penny',
      });
    });
  });

  describe('focus and blur handlers', () => {
    it('applies focus style on focus and removes on blur', () => {
      const { getByRole, container } = render(<DatasetCard dataset={mockConfig} context={context} referrer={referrer} />);
      const thisCard = getByRole('link');
      const card = container.querySelector('.MuiCard-root');

      fireEvent.focus(thisCard);
      expect(card).toHaveClass('card_withFocus');

      fireEvent.blur(thisCard);
      expect(card).not.toHaveClass('card_withFocus');
    });
  });
});
