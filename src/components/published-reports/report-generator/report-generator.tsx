import React, { FunctionComponent } from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { config, accountStatementFebData } from './mockData';
import ReportTable from './report-table/report-table';
import { styles } from './report-generator-styles';
import { getTableColumnConfig } from './report-generator-helper';

interface IReportTable {
  width: string;
  data;
  colConfig;
}

interface IReportGenerator {
  reportConfig: {
    documentTitle: string;
    documentHeader: { field: string; value: string }[];
    tables: IReportTable[];
  };
}

const ReportGenerator: FunctionComponent<IReportGenerator> = ({ reportConfig, reportData }) => {
  const { documentTitle, documentHeader, tables } = reportConfig;
  const { pageContainer, headerFieldName } = styles;

  return (
    <Document title="StatementReport">
      <Page style={pageContainer}>
        <Text style={styles.title}>{documentTitle}</Text>
        {documentHeader.map(line => {
          const { name, value, style } = line;
          const customStyle = styles[style];
          const customContainerStyle = styles[`${style}Container`];
          return (
            <Text style={customContainerStyle ? customContainerStyle : styles.documentHeader}>
              <Text style={customStyle ? customStyle : headerFieldName}>{`${name}${!!value ? ': ' : ''}`}</Text>
              {value}
            </Text>
          );
        })}
        {tables.map(table => {
          const { width, fields } = table;
          const colConfig = getTableColumnConfig(config, fields);
          return (
            <View style={{ width: width }}>
              <ReportTable data={reportData} colConfig={colConfig} />
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

export default ReportGenerator;
