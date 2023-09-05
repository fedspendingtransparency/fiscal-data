import React from "react";
import {
  act,
  fireEvent,
  render,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import fetchMock from 'fetch-mock';
import HomeHighlightCard from './home-highlight-card';
import Analytics from "../../../utils/analytics/analytics";
import globalConstants from "../../../helpers/constants";

const mockData =
{
  title: 'test title',
  name: 'Debt to the Penny',
  tagLine: 'test tag line',
  slug: '/debt-to-the-penny/',
  data: {
    chartType: 'LINE',
    api_id: 1,
    fields: ["current_month_net_rcpt_amt"],
    filters: [{
      key: "classification_desc",
      operator: 'eq',
      value: "Total%20--%20Receipts"
    }],
    format: "CURRENCY"
  },
  apis: [
    {
      apiId: 1,
      dateField: 'reportDate',
      reportDate: '2020-05-31',
      latestDate: '2020-05-31',
      pathName: 'debt-to-the-penny',
    }
  ]
};

const mockDataLink = `/datasets${mockData.slug}${mockData.apis[0].pathName}`;

// Jest gives an error about the following not being implemented even though the tests pass.
HTMLCanvasElement.prototype.getContext = jest.fn();

const responseMockData = require('../../../components/__tests__/profilerResponse.json');

fetchMock.get(`begin:http://localhost:3000/api/fiscal_service/`,
  responseMockData['noDataPrelimResponse']);
fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
  responseMockData['noDataPrelimResponse']);

jest.mock('../../../utils/analytics/analytics', () => ({
  event: jest.fn()
}));

describe('HomeHighlightCard', () => {

  it('entire card, when clicked, links to relevant dataset detail page', async () => {
    let navTarget = ''
    const { getByTestId } = render(<HomeHighlightCard dataset={mockData} />);
    await waitForElementToBeRemoved(() => getByTestId('loadingSection'));
    navTarget = getByTestId('highlight-link')['href'];
    expect(navTarget).toContain(mockDataLink);
  });

  it('contains the title', async () => {
    const { getByTestId } = render(<HomeHighlightCard dataset={mockData} />);
    await waitForElementToBeRemoved(() => getByTestId('loadingSection'));
    const { getByText } = within(getByTestId('highlight-title'));
    expect(getByText('test title')).toBeInTheDocument();
  });

  it('contains the dataset name', async () => {
    const { getByTestId } = render(<HomeHighlightCard dataset={mockData} />);
    await waitForElementToBeRemoved(() => getByTestId('loadingSection'));
    const { getByText } = within(getByTestId('highlight-name'));
    expect(getByText('Debt to the Penny')).toBeInTheDocument();
  });

  it('contains the chart', async () => {
    const { getByTestId } = render(<HomeHighlightCard dataset={mockData} />);
    await waitForElementToBeRemoved(() => getByTestId('loadingSection'));
    const stats = getByTestId('highlight-chart');
    expect(stats).toBeDefined();
  });

  it(`generates a static image with glitter instead of a graph for the U.S. Treasury-owned
    gold dataset`, async () => {
    const data = {
      ...mockData.data,
      chartType: 'IMAGE',
      image: {
        src: "/images/gold-bars.webp",
        alt: "Image of gold bars",
        sparklePoints: [
          ['1.5rem', '-1.5rem'],
          ['2.5rem', '-2.5rem'],
          ['3.5rem', '-3.5rem'],
          ['4.5rem', '-4.5rem']
        ]
      }
    };
    const treasuryData = { ...mockData, data };

    const { getByTestId, queryByTestId, getAllByTestId } = render(
      <HomeHighlightCard dataset={treasuryData} />
    );
    await waitForElementToBeRemoved(() => getByTestId('loadingSection'));
    expect(getByTestId('image-container')).toBeInTheDocument();
    const sparkles = getAllByTestId('scintilla');
    expect(sparkles.length).toStrictEqual(4);
    expect(sparkles.map(s => s.style.left).sort()).toStrictEqual([
      '1.5rem',
      '2.5rem',
      '3.5rem',
      '4.5rem'
    ]);
    expect(queryByTestId('highlight-chart')).not.toBeInTheDocument();
  });

  it(`prevents cards from fetching data until the card is made visible
    for the first time`, async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchSpy.mockClear();
    const { rerender } = render(<HomeHighlightCard dataset={mockData} hidden />);
    expect(fetchSpy).not.toHaveBeenCalled();
    rerender(<HomeHighlightCard dataset={mockData} hidden={false} />);
    expect(fetchSpy).toHaveBeenCalled();
  });

  describe('analytics', () => {
    jest.useFakeTimers();

    const ANALYTICS_CLICK_ACTION = globalConstants.config.homepage.analyticsActions.click;
    const ANALYTICS_CHART_ACTION = globalConstants.config.homepage.analyticsActions.chart
    const ANALYTICS_CARD_ACTION = globalConstants.config.homepage.analyticsActions.card;

    beforeEach(() => {
      Analytics.event.mockClear();
    });

    it('clicking sends action', async () => {
      const { getByTestId } = render(<HomeHighlightCard dataset={mockData} />);
      await waitForElementToBeRemoved(() => getByTestId('loadingSection'));

      fireEvent.click(getByTestId('highlight-link'));

      expect(Analytics.event).toHaveBeenCalledWith({
        category: 'Fiscal Data - Homepage Cards',
        action: ANALYTICS_CLICK_ACTION,
        label: 'test title'
      });
    });

    it('hovering over the chart sends action and pushes GA4 datalayer', async () => {
      window.dataLayer = window.dataLayer || [];
      const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

      const { getByTestId } = render(<HomeHighlightCard dataset={mockData} />);
      await waitForElementToBeRemoved(() => getByTestId('loadingSection'));
      jest.runAllTimers();

      const chartSvg = getByTestId('highlight-chart');
      fireEvent.mouseOver(chartSvg);

      act(() => jest.advanceTimersByTime(3000));

      expect(Analytics.event).toHaveBeenCalledWith({
        category: 'Fiscal Data - Homepage Cards',
        action: ANALYTICS_CHART_ACTION,
        label: 'test title'
      });

      expect(datalayerSpy).toHaveBeenCalledWith({
        event: 'Chart Hover',
        eventLabel: 'test title'
      });
    });

    it('leaving the chart does not send action', async () => {
      const { getByTestId } = render(<HomeHighlightCard dataset={mockData} />);
      await waitForElementToBeRemoved(() => getByTestId('loadingSection'));
      jest.runAllTimers();

      const chartSvg = getByTestId('highlight-chart');
      fireEvent.mouseOver(chartSvg);
      act(() => jest.advanceTimersByTime(2000));

      fireEvent.mouseLeave(chartSvg);

      act(() => jest.advanceTimersByTime(2000));

      expect(Analytics.event).not.toHaveBeenCalled();
    });

    it('hovering over the dataset details link sends action', async () => {
      const { getByTestId } = render(<HomeHighlightCard dataset={mockData} />);
      await waitForElementToBeRemoved(() => getByTestId('loadingSection'));
      jest.runAllTimers();

      const card = getByTestId('highlight-link');
      fireEvent.mouseOver(card);

      act(() => jest.advanceTimersByTime(3000));

      expect(Analytics.event).toHaveBeenCalledWith({
        category: 'Fiscal Data - Homepage Cards',
        action: ANALYTICS_CARD_ACTION,
        label: 'test title'
      });

    });

    it('leaving the card sends does not sent action', async () => {
      const { getByTestId } = render(<HomeHighlightCard dataset={mockData} />);
      await waitForElementToBeRemoved(() => getByTestId('loadingSection'));
      jest.runAllTimers();

      const card = getByTestId('highlight-link');
      fireEvent.mouseOver(card);

      act(() => jest.advanceTimersByTime(2000));

      fireEvent.mouseLeave(card);

      act(() => jest.advanceTimersByTime(2000));

      expect(Analytics.event).not.toHaveBeenCalled();

    });

    it('continues loading when api id is invalid', async () => {
      let invalidApiMockData = mockData;
      invalidApiMockData.api_id = 2;
      const { getByTestId } = render(<HomeHighlightCard dataset={invalidApiMockData} />);

      expect(getByTestId('loadingSection')).toBeInTheDocument();
    });
  });
});
