import React from 'react';
import {render} from '@testing-library/react';
import UnderstandingDeficit from "./understanding-deficit";
import {setGlobalFetchMatchingResponse} from "../../../../../utils/mock-utils";

import {nationalDeficitSectionIds} from "../national-deficit";
import {understandingDeficitMatchers}
  from "../../../explainer-helpers/national-deficit/national-deficit-test-helper";
import {waitFor} from "@testing-library/dom";


describe('Deficit and Surplus Causes Section', () => {
  const sectionId = nationalDeficitSectionIds[1];
  const glossary = [];
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers);
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('renders the text content', () => {
    const {getByTestId} =
      render(<UnderstandingDeficit sectionId={sectionId} glossary={glossary} />);
    expect(getByTestId('textContent')).toBeInTheDocument();
  });

  it('renders the bar chart', async () => {
    const {getByTestId} =
      render(<UnderstandingDeficit sectionId={sectionId} glossary={glossary} />);
    await waitFor(() => {
      expect(getByTestId('deficitComparisonChart')).toBeInTheDocument();
    })
  });

  it('renders the surplus illustration', () => {
    const {getByTestId} =
      render(<UnderstandingDeficit sectionId={sectionId} glossary={glossary} />);
    expect(getByTestId('surplus-illustration')).toBeInTheDocument();
  });

  it('renders the spending label', async () => {
    const {getByText} =
      render(<UnderstandingDeficit sectionId={sectionId} glossary={glossary} />);
    await waitFor(() => {
      expect(getByText('In FY 2021, the federal government')).toBeInTheDocument();
    })
  });

});


