import React from 'react';
import renderer from 'react-test-renderer';
import MetadataTab from "./metadata-tab";
import DtgTable from '../dtg-table/dtg-table';

describe('MetadataTab', () => {
  const mockConfig = {
    name: 'metadata test',
    summaryText: 'long description of the metadata test',
    tagLine: 'shorter description',
    updateFrequency: 'frequently',
    techSpecs: {
      earliestDate: '12/12/12',
      latestDate: '1/1/20'
    },
    relatedTopics: ['topic1', 'topic2'],
    slug: '/detailed-url-info/'
  };

  let component = renderer.create();
  let instance;
  beforeAll(() => {
    renderer.act(() => {
      component = renderer.create(
        <MetadataTab config={mockConfig} />);
    });
    instance = component.root;
  });

  it('should pass along its data array to the dtgTable component', () => {
    const tableData = instance.findByType(DtgTable).props.tableProps.data;
    expect(tableData).toMatchSnapshot();
  });

  it("sets aria-label to dataset name metadata", ()=> {
    expect(instance.findByType("table").props['aria-label']).toBe(`${mockConfig.name} metadata`)
  })
});
