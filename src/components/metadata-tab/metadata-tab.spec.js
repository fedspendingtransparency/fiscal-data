import React from 'react';
import MetadataTab from './metadata-tab';
import { RecoilRoot } from 'recoil';
import { render, within } from '@testing-library/react';

describe('MetadataTab', () => {
  const mockConfig = {
    name: 'metadata test',
    summaryText: 'long description of the metadata test',
    tagLine: 'shorter description',
    updateFrequency: 'frequently',
    techSpecs: {
      earliestDate: '12/12/12',
      latestDate: '1/1/20',
    },
    relatedTopics: ['topic1', 'topic2'],
    slug: '/detailed-url-info/',
  };

  it('should pass along its data array to the dtgTable component', () => {
    const { getAllByRole, getByRole } = render(
      <RecoilRoot>
        <MetadataTab config={mockConfig} />
      </RecoilRoot>
    );
    expect(getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(getByRole('columnheader', { name: 'Definition' })).toBeInTheDocument();
    const rows = getAllByRole('row');
    expect(within(rows[1]).getByRole('cell', { name: 'Title' })).toBeInTheDocument();
    expect(within(rows[1]).getByRole('cell', { name: mockConfig.name })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: 'Description (Long)' })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: mockConfig.summaryText })).toBeInTheDocument();
    expect(rows).toHaveLength(8);
  });

  it('sets aria-label to dataset name metadata', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <MetadataTab config={mockConfig} />
      </RecoilRoot>
    );
    expect(getByRole('table', { name: `${mockConfig.name} metadata` })).toBeInTheDocument();
  });
});
