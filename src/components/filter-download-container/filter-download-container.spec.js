import React from 'react';
import renderer from 'react-test-renderer';
import FilterAndDownload from "./filter-download-container";

jest.mock('../download-wrapper/download-wrapper',  () => () => "DownloadWrapper");
describe('FilterDownloadContainer', () => {
  let component = renderer.create();
  HTMLCanvasElement.prototype.getContext = jest.fn();

  renderer.act(() => {
    component = renderer.create(
      <FilterAndDownload
          dateRange={{to: new Date(), from: new Date()}}
          isFiltered={false}
          selectedTable={null}
          dataset={{}}
      />
    );
  });
  const instance = component.root;

  it('renders the component', () =>{
    const theComponent = instance.findByProps({'data-test-id': 'filterDownloadContainer'});
    expect(theComponent).toBeDefined();
  });
});
