import React from 'react';
import { render } from '@testing-library/react';
import DatasetAboutTabs from './dataset-properties-tabs';
import { RecoilRoot } from 'recoil';

describe('DatasetAboutTabs', () => {
  const tabData = {
    relatedTopics: ['topic1', 'topic2'],
    notesAndKnownLimitations: 'The brain in germane goes plainly against the grain.',
    apis: [
      {
        fields: [
          {
            columnName: 'reporting_date',
            definition: 'Reporting date for the data',
            tableName: 'Summary of Treasury Securities Outstanding',
            prettyName: 'Calendar Date',
            dataType: 'DATE',
            isRequired: 'yes',
          },
        ],
      },
    ],
    techSpecs: {
      updateFrequency: 'blank',
    },
  };

  it('contains a NotesAndLimitations component with expected props', () => {
    const { getByText } = render(
      <RecoilRoot>
        <DatasetAboutTabs config={tabData} test />
      </RecoilRoot>
    );
    expect(getByText(tabData.notesAndKnownLimitations)).toBeInTheDocument();
  });

  it('creates a container to hold the tabs', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DatasetAboutTabs config={tabData} test />
      </RecoilRoot>
    );
    expect(getByTestId('tabsContainer')).toBeDefined();
  });

  it('creates a tab label for each tab property', () => {
    const { getByLabelText } = render(
      <RecoilRoot>
        <DatasetAboutTabs config={tabData} test />
      </RecoilRoot>
    );
    expect(getByLabelText('Data Dictionary')).toBeInTheDocument();
    expect(getByLabelText('Data Tables')).toBeInTheDocument();
    expect(getByLabelText('Metadata')).toBeInTheDocument();
    expect(getByLabelText('Notes & Known Limitations')).toBeInTheDocument();
  });
});
