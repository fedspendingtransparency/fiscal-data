import React from 'react';
import {
  render,
  fireEvent
} from '@testing-library/react';
import {
  nationalDebtSectionIds,
  nationalDebtSectionConfigs,
  visualizingTheDebtTableContent,
} from "../national-debt";
import { GrowingNationalDebtSection } from "./growing-national-debt";
import { VisualizingTheDebtAccordion } from "./debt-accordion/visualizing-the-debt-accordion";
import {
  mockExplainerPageResponse,
  mockBeaGDPData
} from "../../../explainer-test-helper"
import {
  determineBEAFetchResponse
} from "../../../../../utils/mock-utils"
import { getYear } from 'date-fns';
import simplifyNumber from '../../../../../helpers/simplify-number/simplifyNumber';
import { breakpointSm } from '../../../../variables.module.scss';

import { growingNationalDebtSectionAccordion } from "./debt-accordion/visualizing-the-debt-accordion.module.scss";
import { waitFor } from "@testing-library/dom"
import Analytics from "../../../../../utils/analytics/analytics";


jest.mock('./variables.module.scss', (content) => ({
  ...content,
  breakpointSm: 600
}));

jest.mock('../../../../../hooks/useBeaGDP', () => {
  return () => mockBeaGDPData;
});

describe('The Growing National Debt', () => {
  const sectionId = nationalDebtSectionIds[3];
  const config = nationalDebtSectionConfigs[sectionId]
  const glossary = [];
  const mockCpiDataset = {
    "2011": "10",
    "2012": "5",
    "2013": "5",
    "2020": "15",
    "2021": "15"
  };


  beforeEach(() => {
    determineBEAFetchResponse(jest, mockExplainerPageResponse);
    jest.spyOn(console, 'warn').mockImplementation(() => {});

  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('renders the Visualizing the Debt table inside an accordion', async () => {
    const { container } = render(
      <GrowingNationalDebtSection sectionId={sectionId} glossary={glossary}
                                  cpiDataByYear={mockCpiDataset}
      />
    );

    expect(await container.querySelector(`.${growingNationalDebtSectionAccordion}`))
    .toBeInTheDocument();
  })

  it('shows the correct amount of rows and columns for different screen sizes', async () => {
    const { findByTestId, findAllByTestId, rerender } = render(
      <VisualizingTheDebtAccordion width={breakpointSm} />
    );
    fireEvent.click(await findByTestId('button'));
    const rowsDesktop = await findAllByTestId('accordion-table-row');
    expect(rowsDesktop).toHaveLength(visualizingTheDebtTableContent.desktop.rows);
    rerender(
      <VisualizingTheDebtAccordion width={breakpointSm-1} />
    );

    const rowsMobile = await findAllByTestId('accordion-table-row');
    expect(rowsMobile).toHaveLength(visualizingTheDebtTableContent.mobile.rows);
  });


  it('contains the two charts contained in this section', async () => {
    const { findAllByTestId } = render(
      <GrowingNationalDebtSection sectionId={sectionId}
                                  glossary={glossary}
                                  cpiDataByYear={mockCpiDataset}
      />
    );
    const allCharts = await findAllByTestId('chart');
    expect(allCharts.length).toStrictEqual(2);
  })



  it('displays the latest date and value', async () => {
    const latestDate = getYear(new Date(mockExplainerPageResponse.data[0][config.dateField]));
    const latestValue = simplifyNumber(mockExplainerPageResponse.data[0][config.valueField], true);

    const { findAllByText, findByText } = render(
      <GrowingNationalDebtSection sectionId={sectionId}
                                  glossary={glossary}
                                  cpiDataByYear={mockCpiDataset}
      />
    );

    // Latest year is also the text content for the last value on the graph's x-axis
    const dateComponents = await findAllByText(latestDate);
    expect(dateComponents[0]).toBeInTheDocument();

    const valueComponent = await findByText(latestValue);
    expect(valueComponent).toBeInTheDocument();
  });

  it('calls the appropriate analytics event when links are clicked on', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText, getAllByText } = render(
      <GrowingNationalDebtSection sectionId={sectionId}
                                  glossary={glossary}
                                  cpiDataByYear={mockCpiDataset}
      />
    );

    const historicalDebt = await waitFor(() => getAllByText('Historical Debt Outstanding')[0]);
    const bls = await waitFor(() => getByText('Bureau of Labor Statistics'));

    historicalDebt.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - U.S. Federal Debt Trends Over the Last 100 Years'
    });
    spy.mockClear();

    bls.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - U.S. Federal Debt Trends Over the Last 100 Years'
    });
    spy.mockClear();
  });
});











