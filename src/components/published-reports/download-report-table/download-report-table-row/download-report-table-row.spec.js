import React from 'react';
import { render } from '@testing-library/react';
import DownloadReportTableRow from './download-report-table-row';
import ReportsSection from '../../reports-section/reports-section';


describe('Download report table row component', () => {
  it('renders a file row', () => {
    const {getByTestId} = render(<DownloadReportTableRow fileName={"filename.pdf"}/>);
    expect(getByTestId('file-download-row')).toBeInTheDocument();
  });

  it('renders a pdf icon with a pdf filename', () => {
    const {getByAltText} = render(<DownloadReportTableRow fileName={"filename.pdf"}/>);
    expect(getByAltText('pdf icon')).toBeInTheDocument();
  });

  it('renders a xls icon with a xls filename', () => {
    const {getByAltText} = render(<DownloadReportTableRow fileName={"filename.xls"}/>);
    expect(getByAltText('xls icon')).toBeInTheDocument();
  });

  it('renders a xls icon when no file extension is given', () => {
    const {getByAltText} = render(<DownloadReportTableRow fileName={"filename"}/>);
    expect(getByAltText('xls icon')).toBeInTheDocument();
  });
});
