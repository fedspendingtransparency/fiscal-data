import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 10,
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    borderColor: '#000',
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  row: {
    flexDirection: 'row',
    borderBottomColor: '#000',
  },
  cell: {
    flex: 1,
    padding: 4,
    borderRightColor: '#000',
  },
  lastCell: {
    flex: 1,
    padding: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
});

const MyDynamicTable = ({ data }) => {
  if (!data || !data.length) return <Text>No data to display.</Text>;

  const columns = Object.keys(data[0]);

  return (
    <View style={styles.tableContainer}>
      <View style={styles.headerRow}>
        {columns.map((col, idx) => (
          <Text key={col} style={[styles.cell, idx === columns.length - 1 && styles.lastCell]}>
            {col}
          </Text>
        ))}
      </View>
      {data.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {columns.map((col, colIndex) => (
            <Text key={colIndex} style={[styles.cell, colIndex === columns.length - 1 && styles.lastCell]}>
              {row[col]}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const PDFBody = ({ data }) => (
  <Document title="StatementReport">
    <Page style={styles.page}>
      <Text style={{ fontSize: 14, marginBottom: 6 }}>Dynamic Transaction Statement</Text>
      <Text>Account: CALIFORNIA, 000000000000505</Text>
      <Text>Report Date: January 2025</Text>
      <Text>Final Report</Text>
      <Text>
        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Beginning Balance:</Text> $485,338,841.76
      </Text>
      <Text>Ending Balance: $490,718,593.54</Text>
      <MyDynamicTable data={data} />
    </Page>
  </Document>
);

export default PDFBody;
