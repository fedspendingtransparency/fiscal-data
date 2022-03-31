import fetchMock from 'fetch-mock';
import React from 'react';
import renderer from "react-test-renderer"
import DatasetDetail from "../dataset-detail"
import { pageContextMock, pageContextMockOneRow } from "../__testmocks__/mocks"

const responseMockData = require('../../components/__tests__/profilerResponse.json');

describe("Dataset detail", () => {
  it('display a notice within the dataset preview section when API data is empty array', async () => {
    fetchMock.get(`begin:http://localhost:3000/api/fiscal_service/v1/accounting/od/savings_bonds_pcs?fields=reporting_date`,
      responseMockData['noDataPrelimResponse']);
    fetchMock.get(`begin:http://localhost:3000/api/fiscal_service/v1/accounting/od/savings_bonds_pcs?fields=series_cd`,
      responseMockData['noDataPrelimResponse']);
    let component = renderer.create();
    await renderer.act(async () => {
      component = await renderer.create(
        <DatasetDetail pageContext={pageContextMock}/>
      );
    });
    const instance = component.root;
    const dataDisplay = instance.findByProps({'id': 'data-display'});
    const messages = dataDisplay.findAllByProps({'className': 'message'});
    const notice = messages[0].findByProps({'className': 'notice'});
    const dataTablePanels = dataDisplay.findAllByProps({ 'id': 'preview-tabpanel-0' });
    await expect(notice.props.children[0]).toBe('NOTE: No data records in response.');
    await expect(dataTablePanels.length).toBe(0);

  });
  it('show data with no notice within the dataset preview section when API data array has at least one row', async () => {
    fetchMock.get(`begin:http://localhost:3000/api/fiscal_service/v1/accounting/od/savings_bonds_pcs_onerow?fields=reporting_date`,
      responseMockData['oneRowPrelimResponse']);
    fetchMock.get(`begin:http://localhost:3000/api/fiscal_service/v1/accounting/od/savings_bonds_pcs_onerow?fields=series_cd`,
      responseMockData['oneRowInformedResponse']);
    let component = renderer.create();
    await renderer.act(async () => {
      component = await renderer.create(
        <DatasetDetail pageContext={pageContextMockOneRow}/>
      );
    });
    const instance = component.root;
    const dataDisplay = instance.findByProps({'id': 'data-display'});
    const messages = dataDisplay.findAllByProps({'className': 'message'});
    await expect(messages.length).toBe(0);
    const dataTablePanels = dataDisplay.findAllByProps({ 'id': 'preview-tabpanel-0' });
    await expect(dataTablePanels.length).toBeTruthy;
  });
});

