import ApiQuickGuide from './api-quick-guide';
import { selectedTable } from './test-helpers/test-helpers';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('API Quick Guide Tab Index', () => {
  const config = {
    apis: [
      {
        tableName: 'table1',
        endpoint: 'sample/url/table_1',
        fields: [
          {
            columnName: 'reporting_date',
            definition: 'Reporting date for the data',
            prettyName: 'Calendar Date',
            dataType: 'DATE',
            isRequired: 'yes',
          },
          {
            columnName: 'reporting_date',
            definition: 'Reporting date for the data',
            prettyName: 'Calendar Date',
            dataType: 'DATE',
            isRequired: 'yes',
          },
        ],
      },
    ],
  };

  jest.spyOn(document, 'getElementById').mockReturnValueOnce({ scrollHeight: 100 });

  it('ensures links are tabIndex: -1 when collapsed and tabIndex: 0 when expanded', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { getByRole } = render(
      <RecoilRoot>
        <ApiQuickGuide config={config} selectedTable={selectedTable} />
      </RecoilRoot>
    );
    jest.runAllTimers();
    const datasetProperties = getByRole('link', { name: 'Dataset Properties', hidden: true });
    expect(datasetProperties).toHaveAttribute('tabIndex', '-1');

    await user.click(getByRole('button', { name: 'Show More' }));
    // expanded after click, all tabIndices are 0
    expect(datasetProperties).toHaveAttribute('tabIndex', '0');

    await user.click(getByRole('button', { name: 'Show Less' }));
    // collapsed after second click, all tabIndices are -1
    expect(datasetProperties).toHaveAttribute('tabIndex', '-1');
  });
});
