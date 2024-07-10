import React, { useState, useEffect } from 'react';
import { Document, PDFViewer, Page, View, Text, PDFDownloadLink } from '@react-pdf/renderer';

// Create styles
const styles = {
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    fontSize: 10,
  },
  container: {
    height: '50rem',
    width: '50rem',
  },
};

const mockData = [
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
  100000000000000,
  '\n',
  123456789,
  '\n',
  987654321,
  '\n',
];

const PDFBody = () => {
  return (
    <>
      <Document title="testPDF.pdf" onRender={() => console.log('Render!')}>
        <Page style={styles.page}>
          <View style={styles.section}>
            <Text>Column Header 1</Text>
            <Text>_______________</Text>
            <Text>{mockData}</Text>
          </View>
          <View style={styles.section}>
            <Text>Column Header 2</Text>
            <Text>_______________</Text>
            <Text>{mockData}</Text>
          </View>
          <View style={styles.section}>
            <Text>Column Header 3</Text>
            <Text>_______________</Text>
            <Text>{mockData}</Text>
          </View>
        </Page>
      </Document>
    </>
  );
};

const PDFGenerator = () => {
  const [test, setTest] = useState(false);
  useEffect(() => {
    setTest(true);
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {test ? (
        <PDFDownloadLink document={<PDFBody />} fileName="testPDF.pdf">
          {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
        </PDFDownloadLink>
      ) : null}
      {/*{test ? (*/}
      {/*  <PDFViewer style={styles.container} fileName="testPDF.pdf">*/}
      {/*    <PDFBody />*/}
      {/*  </PDFViewer>*/}
      {/*) : null}*/}
    </div>
  );
};

export default PDFGenerator;
