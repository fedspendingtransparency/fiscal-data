import React from 'react';
import ApiQuickGuide, { methods } from './api-quick-guide';
import { RecoilRoot } from 'recoil';
import { selectedTable } from './test-helpers/test-helpers';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

require('jest-fetch-mock');

describe('API Quick Guide', () => {
  const titleText = 'API Quick Guide';
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
        ],
      },
    ],
  };

  jest.spyOn(document, 'getElementById').mockReturnValueOnce({ scrollHeight: 100 });

  it('displays as collapsed by default', () => {
    const { getByRole } = render(<ApiQuickGuide config={config} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
    expect(getByRole('button', { name: 'Show More' })).toBeInTheDocument();
  });

  // Other tests that depend on expanding the component state
  describe('When expanded', () => {
    it('should pass along its title param to the DatasetSectionContainer component', () => {
      const { getByRole } = render(<ApiQuickGuide config={config} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
      expect(getByRole('heading', { level: 2, name: titleText })).toBeInTheDocument();
    });

    it('should present an ApiQuickGuideSection for Methods with a title and description', () => {
      const { getByText, getByRole } = render(<ApiQuickGuide config={config} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
      userEvent.click(getByRole('button', { name: 'Show More' }));
      expect(getByText(methods.title)).toBeInTheDocument();
      expect(getByText(methods.desc)).toBeInTheDocument();
    });

    it('renders the DatasetDetailFields component', () => {
      const { getByText } = render(<ApiQuickGuide config={config} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
      expect(getByText('Fields')).toBeInTheDocument();
    });

    it('renders the Accordions component', () => {
      const { getByText, getByRole } = render(<ApiQuickGuide config={config} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
      userEvent.click(getByRole('button', { name: 'Show More' }));
      expect(getByText('Parameters')).toBeInTheDocument();
    });

    it('renders the DatasetDetailEndpoints component', () => {
      const { getByText } = render(<ApiQuickGuide config={config} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
      expect(getByText('Endpoint')).toBeInTheDocument();
    });

    it('renders the DatasetDetailExamples component', () => {
      const { getByText, getByRole } = render(<ApiQuickGuide config={config} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
      userEvent.click(getByRole('button', { name: 'Show More' }));
      expect(getByText('Example Request & Response')).toBeInTheDocument();
    });
  });
});
