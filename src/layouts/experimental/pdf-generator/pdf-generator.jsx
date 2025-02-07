import React, { useState } from 'react';
import { PDFViewer, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer';
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
  },
};
const PDFGenerator = () => {
  const [showPDF, setShowPDF] = useState(true);

  const handleShowPDF = () => {
    setShowPDF(prev => !prev);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PDFDownloadLink document={<PDFBody data={mockData} />} fileName="StatementReport.pdf">
        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download PDF')}
      </PDFDownloadLink>
      <button style={styles.button} onClick={handleShowPDF}>
        {showPDF ? 'Hide PDF Viewer' : 'Show PDF Viewer'}
      </button>
      {showPDF && (
        <div style={{ border: '1px solid #ccc', height: '600px', marginTop: '1rem' }}>
          <PDFViewer style={styles.container}>
            <PDFBody data={mockData} data2={mockData2} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
};

export default PDFGenerator;
