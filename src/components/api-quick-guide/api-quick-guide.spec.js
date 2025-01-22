import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ApiQuickGuide from './api-quick-guide';
import Accordions from './accordions/accordions';
import DatasetDetailEndpoints from './dataset-detail-endpoints/dataset-detail-endpoints';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DatasetDetailFields from './dataset-detail-fields';
import DatasetDetailExamples from './dataset-detail-examples/dataset-detail-examples';
import SectionCollapseButton from '../section-collapse/section-collapse-button';
import { RecoilRoot } from 'recoil';

import { selectedTable } from './test-helpers/test-helpers';
import { render } from '@testing-library/react';
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
    const instance = render(<ApiQuickGuide config={config} selectedTable={selectedTable} />, { wrapper: RecoilRoot });
    // expect(instance).to
    // expect(instance.findByProps({ className: 'sectionWrapper collapsed' })).toBeDefined();
  });

  // Other tests that depend on expanding the component state
  describe('When expanded', () => {
    // let component;
    let instance;

    // beforeEach(() => {
    //   act(() => {
    //     component = renderer.create(
    //       <RecoilRoot>
    //         <ApiQuickGuide config={config} selectedTable={selectedTable} />
    //       </RecoilRoot>
    //     );
    //   });
    //
    //   instance = component.root;
    //
    //   // Force the state to ensure rendering of all components
    //   act(() => {
    //     instance.findByType(SectionCollapseButton).props.handleToggle(false);
    //   });
    // });

    it('should pass along its title param to the DatasetSectionContainer component', () => {
      const titleProperty = instance.findByType(DatasetSectionContainer).props.title;
      expect(titleProperty).toBe(titleText);
    });

    it('should present an ApiQuickGuideSection for Methods with a title and description', () => {
      expect(instance.findByProps({ id: 'method-section' }).props.title).toBeDefined();
      expect(instance.findByProps({ id: 'method-section' }).props.description).toBeDefined();
    });

    it('should pass along its api config to the DatasetDetailFields component', () => {
      const apis = instance.findByType(DatasetDetailFields).props.apis;
      expect(apis).toBe(config.apis);
    });

    it('should pass along the selectedTable to the Accordions component', () => {
      const curSelectedTable = instance.findByType(Accordions).props.selectedTable;
      expect(curSelectedTable).toBe(selectedTable);
    });

    it('should pass along the selectedTable prop to the DatasetDetailEndpoints component', () => {
      const endpointComp = instance.findByType(DatasetDetailEndpoints);
      expect(endpointComp.props.selectedTable).toBe(selectedTable);
    });

    it('passes the selectedTable to the DatasetDetailExamples component', () => {
      const datasetDetailComp = instance.findByType(DatasetDetailExamples);
      expect(datasetDetailComp.props.selectedTable).toBe(selectedTable);
    });

    it('displays a toggle button', () => {
      const toggleButton = instance.findByType(SectionCollapseButton);
      expect(toggleButton).toBeDefined();
    });
  });
});
