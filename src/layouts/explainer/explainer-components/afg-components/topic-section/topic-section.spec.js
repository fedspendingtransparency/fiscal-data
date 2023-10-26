import React from 'react';
import TopicSection from '../topic-section/topic-section';
import { render, waitFor } from '@testing-library/react';
import { useStaticQuery } from 'gatsby';
import { setGlobalFetchMatchingResponse } from '../../../../../utils/mock-utils';
import { mockEndpointResponseMap } from '../../../explainer-helpers/afg-overview-test-helper';
describe('Compare Section Component', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
  const glossaryMock = {
    allGlossaryCsv: {
      glossaryCsv: [
        {
          term: 'Excise',
          definition:
            'A tax collected on certain goods and commodities produced or sold within the country (i.e. alcohol and ' +
            'tobacco, gasoline) and on licenses granted for certain activities (i.e. import/export license).',
          site_page: 'Revenue Explainer & AFG Overview Page',
          id: '12',
          url_display: '',
          url_path: '',
        },
      ],
    },
    extensions: {},
  };

  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
  });
  beforeEach(() => {
    // mock all data endpoints for inline evergreen values
    setGlobalFetchMatchingResponse(jest, mockEndpointResponseMap);
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('renders the component', () => {
    const { getByTestId } = render(<TopicSection glossary={[]} fiscalYear={2022} setGlossaryClickEvent={jest.fn()} />);
    expect(getByTestId('topic-section')).toBeInTheDocument();
  });

  it('correctly populates values from API data / alt september language', async () => {
    const { getByText, getAllByText } = render(<TopicSection glossary={[]} fiscalYear={2022} setGlossaryClickEvent={jest.fn()} />);

    await waitFor(() => {
      getByText('the federal government has collected $4.41 trillion', { exact: false });
      getByText('$5.35 trillion', { exact: false });
      getByText('by which spending exceeded revenue, $946 billion in', { exact: false });
      getByText('contributed', { exact: false });
      getByText('of $30.93 trillion through', { exact: false });
      getByText('September 2022', { exact: false });
      getByText('$4.05 trillion', { exact: false });
      getByText('$6.82 trillion', { exact: false });
      getByText('Income Security.', { exact: false });
      getByText('government spent $2.77 trillion more than it collected', { exact: false });
      //National Deficit
      getByText('$360 billion ', { exact: false });
      getByText('the government had $28.43 trillion in federal', { exact: false });
      expect(getAllByText('2022', { exact: false }).length).toBe(5);
      expect(getAllByText('2021', { exact: false }).length).toBe(4);
      expect(getAllByText('2020', { exact: false }).length).toBeGreaterThan(1);
    });
  });
});
