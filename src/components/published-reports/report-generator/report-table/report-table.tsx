import { Text, View } from '@react-pdf/renderer';
import React from 'react';
import { styles } from '../report-generator-styles';

const ReportTable = ({ data, colConfig }) => {
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
      {/*{data.map((row, rowIndex) => (*/}
      {/*  <View style={styles.row} key={rowIndex}>*/}
      {/*    {columns.map((col, colIndex) => (*/}
      {/*      <Text*/}
      {/*        key={colIndex}*/}
      {/*        style={[styles.cell, { minWidth: colConfig[col].width }, colConfig[col]?.style, colIndex === columns.length - 1 && styles.lastCell]}*/}
      {/*        wrap={false}*/}
      {/*      >*/}
      {/*        {row[col]}*/}
      {/*      </Text>*/}
      {/*    ))}*/}
      {/*  </View>*/}
      {/*))}*/}
    </View>
  );
};

export default ReportTable;
