import { fileSizeTranslator } from '../datatables-tab/datatables-tab-helpers';
import fileDownload from 'js-file-download';
import { stringify } from 'csv-stringify/sync';
import { replaceNbsps } from './download-helpers';

export const convertDataDictionaryToCsv = dataset => {
  console.log('dataset: ', dataset);
  const apis = dataset.apis;
  if (apis && apis[0] && apis[0].fields && apis[0].fields.length) {
    const allTableFields = apis.reduce((accumulated, current) => {
      return accumulated.concat(addDataset(current.fields, dataset));
    }, []);
    return replaceNbsps(
      stringify(allTableFields, {
        header: true,
        columns: [
          {
            key: 'dataset',
            header: 'dataset',
          },
          {
            key: 'tableName',
            header: 'data_table_name',
          },
          {
            key: 'columnName',
            header: 'field_name',
          },
          {
            key: 'prettyName',
            header: 'display_name',
          },
          {
            key: 'definition',
            header: 'description',
          },
          {
            key: 'dataType',
            header: 'data_type',
          },
          {
            key: 'isRequired',
            header: 'is_required',
          },
        ],
      })
    );
  } else {
    return '';
  }
};

export const replaceNbsps = str => {
  const re = new RegExp(String.fromCharCode(160), 'g'); // global search for " "
  return str.replace(re, ' ');
};

const addDataset = (fields, dataset) => {
  return fields.map(field => Object.assign({ dataset: dataset.name }, field));
};

export const suggestDictionaryDownloadName = datasetName => {
  return datasetName.replace(/[^a-zA-z ]/g, '') + ' Data Dictionary.csv';
};

export const calcDictionaryDownloadSize = csvData => {
  return fileSizeTranslator(1000 + csvData.length);
};

export const triggerDataDictionaryDownload = (csvData, datasetName) => {
  return fileDownload(csvData, suggestDictionaryDownloadName(datasetName));
};
