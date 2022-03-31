import fetchMock from 'fetch-mock';
import React from 'react';
import renderer from "react-test-renderer"
import DatasetDetail from "../dataset-detail"
import { pageContextMockForErrorStatus, pageContextMockForWrongContentType }  from "../__testmocks__/mocks"
import { Response } from "node-fetch"

describe("Dataset detail", () => {

  it('displays an error notice within when API response returns a non-200 status code', async () => {
    fetchMock.mock(`begin:http://localhost:3000/api/fiscal_service/v1/accounting/od/savings_bonds_pcs-error-status?fields=reporting_date`,
      400, {repeat: 2});

    let component = renderer.create();
    await renderer.act(async () => {
      component = await renderer.create(
        <DatasetDetail pageContext={pageContextMockForErrorStatus}/>
      );
    });
    const instance = component.root;
    const dataDisplay = instance.findByProps({'id': 'data-display'});

    const dataTablePanels = dataDisplay.findAllByProps({ 'id': 'preview-tabpanel-0' });
    expect(dataTablePanels.length).toBe(0); // data preview tab-panels are not rendered

    const messages = dataDisplay.findAllByProps({'className': 'message'});
    const errors = messages[0].findAllByProps({'className': 'error'});
    const retryBtn = errors[0].findByType('button') || undefined;
    expect(retryBtn.props.children).toBe('Try again'); // there is a button inside an error message
    const urlRegEx = /localhost:3000\/api\/fiscal_service\/v1\/accounting\/od\/savings_bonds_pcs-error-status\?fields=reporting_date/;
    expect(fetchMock.calls(urlRegEx).length).toBe(1); // one api call happened at on render

    await renderer.act(async () => retryBtn.props.onClick());
    expect(fetchMock.calls(urlRegEx).length).toBe(2); // after retry is clicked a second api call is registered
  });

  it('displays an error notice within when API response returns a 200 code but has a header that indicates a content-type other than json', async () => {
    fetchMock.get(`begin:http://localhost:3000/api/fiscal_service/v1/accounting/od/savings_bonds_pcs-html-content?fields=reporting_date`,
      new Response('some html or text response body',{status: 200, headers: {'Content-Type': 'text/html'}}));

    let component = renderer.create();
    await renderer.act(async () => {
      component = await renderer.create(
        <DatasetDetail pageContext={pageContextMockForWrongContentType}/>
      );
    });
    const instance = component.root;
    const dataDisplay = instance.findByProps({'id': 'data-display'});

    const dataTablePanels = dataDisplay.findAllByProps({ 'id': 'preview-tabpanel-0' });
    expect(dataTablePanels.length).toBe(0); // data preview tab-panels are not rendered

    const messages = dataDisplay.findAllByProps({'className': 'message'});
    const errors = messages[0].findAllByProps({'className': 'error'});
    const retryBtn = errors[0].findByType('button') || undefined;
    expect(retryBtn.props.children).toBe('Try again'); // there is a button inside an error message
  });

});
