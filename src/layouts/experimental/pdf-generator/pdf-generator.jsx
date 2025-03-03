import React, { useEffect, useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer/lib/react-pdf.browser';
import ReportGenerator from '../../../components/published-reports/report-generator/report-generator';
import { accountStatementReportConfig, accountStatementFebData } from '../../../components/published-reports/report-generator/mockData';
const styles = {
  container: {
    height: '50rem',
    width: '50rem',
  },
  button: {
    height: '2rem',
    width: '10rem',
  },
};
const PDFGenerator = () => {
  const [showPDF, setShowPDF] = useState(false);

  //PDF download link is a web only api and the build will fail if it is available immediately
  useEffect(() => {
    setShowPDF(true);
  }, []);

  const fileName = accountStatementReportConfig.downloadName;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '70rem' }}>
      {showPDF ? (
        <PDFDownloadLink
          document={<ReportGenerator reportConfig={accountStatementReportConfig} reportData={accountStatementFebData.data} />}
          fileName={`${fileName}.pdf`}
        >
          {({ blob, url, loading, error }) => (loading ? 'Loading download link...' : `Download ${fileName}.pdf`)}
        </PDFDownloadLink>
      ) : null}
      {/*PDFViewer can be used for faster local testing*/}
      {/*{showPDF && (*/}
      {/*  <div style={{ border: '1px solid #ccc', height: '600px', marginTop: '4rem' }}>*/}
      {/*    <PDFViewer style={styles.container}>*/}
      {/*      <ReportGenerator reportConfig={accountStatementReportConfig} reportData={accountStatementFebData.data} />*/}
      {/*    </PDFViewer>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};

export default PDFGenerator;
