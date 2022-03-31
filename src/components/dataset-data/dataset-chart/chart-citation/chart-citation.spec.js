import React from 'react';
import { render } from '@testing-library/react';
import { format } from 'date-fns';
import ChartCitation, { chartCitationTitle, chartCitationText } from './chart-citation';
import globalConstants from '../../../../helpers/constants';

describe('ChartCitation', () => {
  const mockSlug = '/mock/slug/here';
  const mockDatasetName = 'mockDataset';
  const today = `, ${format(new Date(), 'PP')}`;

  let getByText;

  beforeEach(() => {
    ({ getByText } = render(
      <ChartCitation slug={mockSlug} currentTableName={mockDatasetName} />
    ));
  });

  it('should display the title in the citation', () => {
    expect(getByText(chartCitationTitle)).toBeInTheDocument();
  });

  it('should display the dataset name in the citation', () => {
    expect(getByText(`${mockDatasetName}${chartCitationText}`)).toBeInTheDocument();
  });

  it('should display the dataset slug in the full url and current date in the citation', () => {
      expect(getByText(today)).toBeInTheDocument();
      expect(getByText(`${globalConstants.BASE_SITE_URL}/datasets${mockSlug}`)).toBeInTheDocument();
  });
});
