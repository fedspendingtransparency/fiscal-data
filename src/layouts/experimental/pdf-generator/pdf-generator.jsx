import React, { useEffect, useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import PDFBody from './pdfBody';
import { mockData, mockData2 } from './mockData';
const styles = {
  container: {
    height: '50rem',
    width: '50rem',
  },
  button: {
    height: '2rem',
    width: '10rem',
    marginBottom: '2rem',
  },
};
const PDFGenerator = () => {
  const [showPDF, setShowPDF] = useState(false);

  //PDF download link is a web only api and the build will fail if it is available immediately
  useEffect(() => {
    setShowPDF(true);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '70rem' }}>
      {showPDF ? (
        <PDFDownloadLink document={<PDFBody data={mockData} data2={mockData2} />} fileName="StatementReport.pdf">
          {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download StatementReport.pdf')}
        </PDFDownloadLink>
      ) : null}
      {/*PDFBody can be used for faster local testing*/}
      {/*{showPDF && (*/}
      {/*  <div style={{ border: '1px solid #ccc', height: '600px', marginTop: '4rem' }}>*/}
      {/*    <PDFViewer style={styles.container}>*/}
      {/*      <PDFBody data={mockData} data2={mockData2} />*/}
      {/*    </PDFViewer>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};

export default PDFGenerator;
