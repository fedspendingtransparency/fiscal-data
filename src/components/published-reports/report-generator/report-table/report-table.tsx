import { Text, View } from '@react-pdf/renderer/lib/react-pdf.browser';
import React, { FunctionComponent } from 'react';
import { styles } from '../report-generator-styles';
import { IReportTable } from '../../../../models/report-generator/IReportTable';
import { formatCellGenerativeValue } from '../format-cell-geneartive-value/format-cell-generative-value';

const ReportTable: FunctionComponent<IReportTable> = ({ data, colConfig, customFormatting }) => {
  const columns = Object.keys(colConfig);
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
          {columns.map((col, colIndex) => {
            const displayValue = formatCellGenerativeValue(row[col], colConfig[col], customFormatting);

            return (
              <Text
                key={colIndex}
                style={[styles.cell, { minWidth: colConfig[col].width }, colConfig[col]?.style, colIndex === columns.length - 1 && styles.lastCell]}
              >
                {displayValue}
              </Text>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default ReportTable;
