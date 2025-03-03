import React, { FunctionComponent } from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer/lib/react-pdf.browser';
import { config } from './mockData';
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
  const { documentTitle, documentHeader, tables, downloadName } = reportConfig;
  const { pageContainer, headerFieldName } = styles;

  return (
    <Document title={downloadName}>
      <Page style={pageContainer}>
        <Text style={styles.title}>{documentTitle}</Text>
        {documentHeader.map((line, index) => {
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
        {tables.map((table, index) => {
          const { width, fields } = table;
          const colConfig = getTableColumnConfig(config, fields);
          return (
            <View style={{ width: width }} key={index}>
              <ReportTable data={reportData} colConfig={colConfig} />
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

export default ReportGenerator;
