import { Text, View } from '@react-pdf/renderer/lib/react-pdf.browser';
import React from 'react';
import { styles } from '../report-generator-styles';

const ReportTable = ({ data, colConfig }) => {
  const columns = Object.keys(colConfig);
  return (
    <View style={styles.tableContainer}>
      <View style={styles.headerRow}>
        {columns.map((col, idx) => {
          return (
            <Text key={col} style={[styles.cell, idx === columns.length - 1 && styles.lastCell]} wrap={false}>
              {colConfig[col].prettyName}
            </Text>
          );
        })}
      </View>
      {data.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {columns.map((col, colIndex) => {
            return (
              <Text key={colIndex} style={[styles.cell, colConfig[col]?.style, colIndex === columns.length - 1 && styles.lastCell]} wrap={false}>
                {row[col] !== 'null' ? row[col] : ''}
              </Text>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default ReportTable;
