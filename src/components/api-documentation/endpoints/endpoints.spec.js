import React from 'react';
import Endpoints from './endpoints';
import { useStaticQuery } from 'gatsby';
import { RecoilRoot } from 'recoil';
import { render, within } from '@testing-library/react';

describe('API Documentation/Endpoints', () => {
  const internalData = require('../../../testData/__dataConfig_for_tests.json');
  const profilerConfigMockData = {
    allDatasets: {
      datasets: internalData.datasets,
    },
    allTopics: {
      topics: internalData.topics,
    },
  };

  let component;
  let instance;

  beforeAll(() => {
    useStaticQuery.mockReturnValue(profilerConfigMockData);
  });

  it('defines the Endpoints section with expected title and heading level', async () => {
    const titleText = 'Endpoints';
    const headingLevel = 2;
    const { findByRole } = render(<Endpoints />, { wrapper: RecoilRoot });
    const heading = await findByRole('heading', { name: titleText, level: headingLevel });
    expect(heading).toBeInTheDocument();
  });

  it('defines the List of Endpoints section with expected title and heading level', async () => {
    const titleText = 'List of Endpoints';
    const headingLevel = 3;
    const { findByRole } = render(<Endpoints />, { wrapper: RecoilRoot });
    const heading = await findByRole('heading', { name: titleText, level: headingLevel });
    expect(heading).toBeInTheDocument();
  });

  it('defines the List of Endpoints table with specified id and column', () => {
    const table = instance.findByProps({ id: 'list-of-endpoints-table' });
    const columns = table.findAllByType('th');
    const expectedColumns = ['Dataset', 'Table Name', 'Endpoint', 'Endpoint Description'];
    const expectedColumnLength = 4;
    expect(columns.length).toBe(expectedColumnLength);
    let foundAllColumns = true;

    for (let i = expectedColumnLength; i--; ) {
      let columnFound = false;
      for (let j = expectedColumnLength; j--; ) {
        if (columns[i].children[0] === expectedColumns[j]) {
          columnFound = true;
          break;
        }
      }
      if (!columnFound) {
        foundAllColumns = false;
        break;
      }
    }

    expect(foundAllColumns).toBe(true);
  });

  it('sorts the endpoint table in alphabetical order of the table name', async () => {
    const { findByTestId, findByRole, findAllByRole } = render(<Endpoints />, { wrapper: RecoilRoot });
    const table = await findByRole('table');
    const tbody = await within(table).findByRole('rowgroup');

    const firstTableRow = within(tbody).findAllByRole('tr')[0];
    const firstTableName = within(firstTableRow).findAllByRole('td')[1];
    // We have at least one table whose name starts with "A" and the first dataset in our
    // mock object is not one of these tables.
    expect(firstTableName.children[0][0]).toStrictEqual('A');
  });

  it('defines the Fields by Endpoint section with expected title and heading level', async () => {
    const titleText = 'Fields by Endpoint';
    const headingLevel = 3;
    const { findByRole } = render(<Endpoints />, { wrapper: RecoilRoot });
    const heading = await findByRole('heading', { name: titleText, level: headingLevel });
    expect(heading).toBeInTheDocument();
  });

  it('<table> tag has aria-describedby reference to <p> element id', async () => {
    const { findByTestId, findByRole } = render(<Endpoints />, { wrapper: RecoilRoot });
    const table = await findByRole('table');
    const p = await findByTestId('list-of-endpoints-id');
    expect(table).toHaveAttribute('aria-describedby', 'list-of-endpoints-id');
    expect(p).toHaveAttribute('id', 'list-of-endpoints-id');
  });
});
