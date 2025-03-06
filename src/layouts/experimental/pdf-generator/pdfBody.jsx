import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer/lib/react-pdf.browser';
import { mockDataColConfig, mockData2ColConfig } from './mockData';

const styles = {
  page: {
    fontSize: 8,
    padding: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    color: '#313178',
    fontFamily: 'Helvetica-Bold',
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    borderColor: '#000',
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontFamily: 'Helvetica-Bold',
  },
  row: {
    flexDirection: 'row',
    borderBottomColor: '#000',
    width: '100%',
  },
  cell: {
    flex: 1,
    padding: 4,
    borderRightColor: '#000',
    width: '100%',
  },
  lastCell: {
    flex: 1,
    padding: 4,
  },
  extraWidth: {
    minWidth: 200,
    color: 'red',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  final: {
    marginBottom: '20',
    fontFamily: 'Helvetica-Oblique',
    fontSize: 10,
  },
  documentHeader: {
    fontSize: 10,
    marginBottom: '4px',
  },
};

const MyDynamicTable = ({ data, colConfig }) => {
  if (!data || !data.length) return <Text>No data to display.</Text>;

  const columns = Object.keys(data[0]);

  return (
    <View style={styles.tableContainer}>
      <View style={styles.headerRow}>
        {columns.map((col, idx) => {
          return (
            <Text key={col} style={[styles.cell, { minWidth: colConfig[col].width }, idx === columns.length - 1 && styles.lastCell]}>
              {colConfig[col].prettyName}
            </Text>
          );
        })}
      </View>
      {data.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {columns.map((col, colIndex) => (
            <Text
              key={colIndex}
              style={[styles.cell, { minWidth: colConfig[col].width }, colConfig[col]?.style, colIndex === columns.length - 1 && styles.lastCell]}
              wrap={false}
            >
              {row[col]}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const PDFBody = ({ data, data2 }) => (
  <Document title="StatementReport">
    <Page style={styles.page}>
      <Text style={styles.title}>Dynamic Transaction Statement</Text>
      <Text style={styles.documentHeader}>
        <Text style={styles.bold}>Account: </Text>CALIFORNIA, 000000000000505
      </Text>
      <Text style={styles.documentHeader}>
        <Text style={styles.bold}>Report Date: </Text>January 2025
      </Text>
      <Text style={styles.final}>Final Report</Text>
      <Text style={styles.documentHeader}>
        <Text style={styles.bold}>Beginning Balance:</Text>$485,338,841.76
      </Text>
      <Text style={styles.documentHeader}>
        <Text style={styles.bold}>Ending Balance:</Text> $490,718,593.54
      </Text>
      <View style={{ width: '50%' }}>
        <MyDynamicTable data={data2} colConfig={mockData2ColConfig} />
      </View>
      <MyDynamicTable data={data} colConfig={mockDataColConfig} />
    </Page>
  </Document>
);

export default PDFBody;
