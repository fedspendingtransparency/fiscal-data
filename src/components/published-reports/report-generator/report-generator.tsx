import React, { FunctionComponent } from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import ReportTable from './report-table/report-table';
import { styles } from './report-generator-styles';
import { getTableColumnConfig } from '../../../helpers/report-generator/report-generator-helper';
import { IReportGenerator } from '../../../models/report-generator/IReportGenerator';
import { formatCellValue } from '../../dtg-table/dtg-table-row/dtg-table-row';

const ReportGenerator: FunctionComponent<IReportGenerator> = ({ generatedReport }) => {
  const { config, data, colConfig, summaryData } = generatedReport;
  const { documentTitle, reportInfo, tables, downloadName, customFormatting, reportSummary } = config;
  const { pageContainer, headerFieldName } = styles;

  return (
    <Document title={downloadName}>
      <Page style={pageContainer}>
        <Text style={styles.title}>{documentTitle}</Text>
        {reportInfo.map((line, index) => {
          const { name, value, style } = line;
          const customStyle = styles[style];
          const customContainerStyle = styles[`${style}Container`];
          return (
            <Text style={customContainerStyle ? customContainerStyle : styles.documentHeader} id={name} key={index}>
              <Text style={customStyle ? customStyle : headerFieldName}>{`${name}${!!value ? ': ' : ''}`}</Text>
              {value}
            </Text>
          );
        })}
        {reportSummary?.map((line, index) => {
          const { name, value, field, type } = line;

          const formattedValue = formatCellValue(value, type, '', field, customFormatting);
          return (
            <Text style={styles.documentHeader} id={name} key={index}>
              <Text style={headerFieldName}>{`${name}${!!value ? ': ' : ''}`}</Text>
              {formattedValue}
            </Text>
          );
        })}
        {tables.map((table, index) => {
          const { width, fields, type } = table;
          const columnConfig = getTableColumnConfig(colConfig, fields);
          const tableData = type === 'summary' ? summaryData : data;
          return (
            <View style={{ width: width }} key={index}>
              <ReportTable data={tableData} colConfig={columnConfig} customFormatting={customFormatting} />
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

export default ReportGenerator;
