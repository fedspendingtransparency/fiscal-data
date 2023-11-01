import React from 'react';
import DatasetAbout, { title } from './dataset-about';
import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

describe('DatasetAbout', () => {
  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();

  const mockConfig = {
    summaryText: 'Nickels, nickels, so many nickels.',
    relatedTopics: ['topic1', 'topic2'],
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

  it('renders the DatasetAbout component which has the expected title text', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DatasetAbout config={mockConfig} test={true} />
      </RecoilRoot>
    );
    const titleEl = getByTestId('sectionHeader');
    expect(titleEl.innerHTML).toBe(title);
  });

  it('renders the summaryText description of a dataset"', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DatasetAbout config={mockConfig} test={true} />{' '}
      </RecoilRoot>
    );
    const descriptionElement = getByTestId('description');
    expect(descriptionElement.innerHTML).toStrictEqual(mockConfig.summaryText);
  });
});
