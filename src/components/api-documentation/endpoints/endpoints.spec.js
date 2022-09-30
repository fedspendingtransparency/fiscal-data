import React from 'react';
import renderer from 'react-test-renderer';
import Endpoints from './endpoints';
import { useStaticQuery } from "gatsby";

describe('API Documentation/Endpoints', () => {

  const internalData = require('../../../testData/__dataConfig_for_tests.json');
  const profilerConfigMockData = {
    allDatasets: {
      datasets: internalData.datasets
    },
    allTopics: {
      topics: internalData.topics
    }

  };

  let component;
  let instance;

  beforeAll(() => {
    useStaticQuery.mockReturnValue(profilerConfigMockData);
    renderer.act(() => {
        component = renderer.create(
          <Endpoints />
        )
      }
    );
    instance = component.root;
  });

  it('defines the Endpoints section with expected title and heading level', () => {
    const titleText = 'Endpoints';
    const headingLevel = 'h2';
    const title = instance.findByProps({'id': 'endpoints'}).findByType(headingLevel);
    expect(title.children[0]).toBe(titleText);
  });

  it('defines the List of Endpoints section with expected title and heading level', () => {
    const titleText = 'List of Endpoints';
    const headingLevel = 'h3';
    const title = instance.findByProps({'id': 'list-of-endpoints'}).findByType(headingLevel);
    expect(title.children[0]).toBe(titleText);
  });

  it('defines the List of Endpoints table with specified id and column', () => {
    const table = instance.findByProps({'id': 'list-of-endpoints-table'});
    const columns = table.findAllByType('th');
    const expectedColumns = ['Dataset', 'Table Name', 'Endpoint', 'Endpoint Description'];
    const expectedColumnLength = 4;
    expect(columns.length).toBe(expectedColumnLength);
    let foundAllColumns = true;

    for (let i = expectedColumnLength; i--;) {
      let columnFound = false;
      for (let j = expectedColumnLength; j--;) {
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

  it('sorts the endpoint table in alphabetical order of the table name', () => {
    const table = instance.findByProps({'id': 'list-of-endpoints-table'});
    const tbody = table.findByType('tbody');
    const firstTableRow = tbody.findAllByType('tr')[0];
    const firstTableName = firstTableRow.findAllByType('td')[1];
    // We have at least one table whose name starts with "A" and the first dataset in our
    // mock object is not one of these tables.
    expect(firstTableName.children[0][0]).toStrictEqual('A');
  });

  it('defines the Fields by Endpoint section with expected title and heading level', () => {
    const titleText = 'Fields by Endpoint';
    const headingLevel = 'h3';
    const title = instance.findByProps({'id': 'fields-by-endpoint'}).findByType(headingLevel);
    expect(title.children[0]).toBe(titleText);
  });

  it('<table> tag has aria-describedby reference to <p> element id', ()=> {
    const table=instance.findByType('table');
    const p=instance.findByProps({'id': 'list-of-endpoints-id'}).findByType('p');
    expect(table.props['aria-describedby']).toBe('list-of-endpoints-id');
    expect(table.props['aria-describedby']).toEqual(p.props['id']);
  })
});
