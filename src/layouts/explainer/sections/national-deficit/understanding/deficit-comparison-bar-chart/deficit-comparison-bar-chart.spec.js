import React from 'react';
import {render} from '@testing-library/react';
import DeficitComparisonBarChart from "./deficit-comparison-bar-chart";
import {nationalDeficitSectionIds} from "../../national-deficit";
import {setGlobalFetchMatchingResponse} from "../../../../../../utils/mock-utils";
import {
  mockDeficitComparisonChartMarkers,
  understandingDeficitMatchers,
  understandingDeficitMatchers_increase,
  understandingDeficitMatchers_noChange
} from "../../../../explainer-helpers/national-deficit/national-deficit-test-helper";
import {waitFor} from "@testing-library/dom";

describe('Deficit Comparison Bar Chart', () => {
  const sectionId = nationalDeficitSectionIds[1];
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers);
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('renders the chart $ values and labels', async () => {
    const {findByText} = render(<DeficitComparisonBarChart sectionId={sectionId} />);

    for (const mockMarker of mockDeficitComparisonChartMarkers) {
      expect(await findByText(mockMarker)).toBeInTheDocument();
    }
  });

  it('renders the chart header', async () => {
    const {findByText} = render(<DeficitComparisonBarChart sectionId={sectionId} />);

    expect(await findByText('U.S. Deficit Compared to Revenue and Spending, FY 2021'))
      .toBeInTheDocument();
  });

  it('renders the chart footer', async () => {
    const {findByText} = render(<DeficitComparisonBarChart sectionId={sectionId} />);

    expect(await findByText('Last Updated: September 30, 2021')).toBeInTheDocument();
  });
});

describe('Callout text', () => {
  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('renders correct callout text when the deficit decreased from the prior fiscal year',
    async () => {
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers);
    const sectionId = nationalDeficitSectionIds[1];

    const {getByText} = render(<DeficitComparisonBarChart sectionId={sectionId} />);
    await waitFor(() => {
      expect(getByText('a decrease of', {exact: false})).toBeInTheDocument();
    })
  });

    it('renders correct callout text when the deficit increased from the prior fiscal year',
      async () => {
        setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers_increase);
        const sectionId = nationalDeficitSectionIds[1];

        const {getByText} = render(<DeficitComparisonBarChart sectionId={sectionId} />);
        await waitFor(() => {
          expect(getByText('an increase of', {exact: false})).toBeInTheDocument();
        })
  });

    it('renders correct callout text when the deficit did not change from the prior fiscal year',
      async () => {
      setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers_noChange);
      const sectionId = nationalDeficitSectionIds[1];

      const {getByText} = render(<DeficitComparisonBarChart sectionId={sectionId} />);
      await waitFor(() => {
        expect(getByText('not changed', {exact: false})).toBeInTheDocument();
      })
  });
});

