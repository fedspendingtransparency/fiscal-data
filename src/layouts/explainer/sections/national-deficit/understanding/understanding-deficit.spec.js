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
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers);
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('renders the text content', () => {
    const {getByTestId} = render(<UnderstandingDeficit sectionId={sectionId} />);
    expect(getByTestId('textContent')).toBeInTheDocument();
  });

  it('renders the bar chart', async () => {
    const {getByTestId} = render(<UnderstandingDeficit sectionId={sectionId} />);
    await waitFor(() => {
      expect(getByTestId('deficitComparisonChart')).toBeInTheDocument();
    })
  });

  it('renders the surplus illustration', () => {
    const {getByTestId} = render(<UnderstandingDeficit sectionId={sectionId} />);
    expect(getByTestId('surplus-illustration')).toBeInTheDocument();
  });
});


