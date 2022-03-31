import React from 'react';
import renderer from 'react-test-renderer';
import PublishedReports from './published-reports';
import FilterSection from './filter-section/filter-section';
import Preview from './preview/preview';
import {reports, dataset} from './test-helper';
import DownloadReport from './download-report/download-report';

describe('Published Reports', () => {
  let component = renderer.create();
  let instance, previewSection;

  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
    renderer.act(() => {
      component = renderer.create(
        <PublishedReports reports={reports} dataset={dataset} />
      );
    });
    instance = component.root;
    previewSection = instance.findByType(Preview);
  });

  it('passes props to the filterSection', () => {
    const filterSection = instance.findByType(FilterSection);
    expect(filterSection.props.reports).toStrictEqual(reports);
    expect(filterSection.props.setSelectedFile).toBeDefined();
  });

  it('displays the download section with a DownloadReport button instance', () => {
    const downloadSection = instance.findByProps({'data-testid': 'downloadSection'});
    expect(downloadSection.findByType(DownloadReport)).toBeDefined();
  });

  it('updates the reportFile to be downloaded when a file is selected in its FilterSection', () => {
    const downloadReport = instance.findByType(DownloadReport);
    const filterSection = instance.findByType(FilterSection);
    // use the setter handed to the filter control to select 2nd report
    renderer.act(() => {
      filterSection.props.setSelectedFile(reports[1]);
    });
    expect(downloadReport.props.reportFile).toBe(reports[1]);

    // use the setter handed to the filter control to select 1st report
    renderer.act(() => {
      filterSection.props.setSelectedFile(reports[0]);
    });
    expect(downloadReport.props.reportFile).toBe(reports[0]);

    // simulate a condition where no report is currently selected in the filter
    renderer.act(() => {
      filterSection.props.setSelectedFile(null);
    });
    expect(downloadReport.props.reportFile).toBe(null);
  });

  it('configured tip is available when selecting a previous report', () => {
    const filterSection = instance.findByType(FilterSection);

    // use the setter handed to the filter control to select 2nd report
    renderer.act(() => {
      filterSection.props.setSelectedFile(reports[1]);
    });

    expect(instance.findByProps({ 'data-testid': 'reports-tip' }).props.children).toBeDefined();
  });

  it('passes the selected file to the Preview component', () => {
    expect(previewSection.props.selectedFile).toBeDefined();
  });
});
