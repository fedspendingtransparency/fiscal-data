import React, { useEffect, useState, useRef } from 'react';
import drawChart from '../../charts/chart-primary';
import ChartLegend from '../../charts/chart-legend/chartLegend';
import ChartCitation from "./chart-citation/chart-citation";
import { thinDataAsNeededForChart } from '../dataset-data-helper/dataset-data-helper';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import {
  info,
  icon,
  chartArea,
  legendActive,
  chartPane,
  chartLegendWrapper,
  viz as vizClass,
  datasetStats,
  legend as legendClass,
} from './dataset-chart.module.scss';

export let chartHooks;
export const callbacks = {
  onHover: (on, item) => {
    if (chartHooks.onHover) {
      chartHooks.onHover(on, item.field)
    }
  },
  onLabelChange: (update, chartFields, setChartFields) => {
    if (!(chartFields && setChartFields && chartHooks.onFieldUpdates)) {
      return;
    }

    const selectedFields = update.map(r => r.field);

    chartFields.forEach(r => {
      r.active = (selectedFields.indexOf(r.field) !== -1);
    });

    chartHooks.onFieldUpdates(selectedFields);
    setChartFields(chartFields.slice())
  }
};

const getYear = (date) => date.getUTCFullYear();

const setFieldsToChart = (fields, pivot) => {
  const whiteList = ['currency', 'number', 'percentage'];
  const blackList = [
    'src_line_nbr',
    'table_nbr',
    'total_incoming_transfers_cnt',
    'from_legacy_system_cnt',
    'from_commercial_book_entry_cnt'
  ];
  const filteredChartFields = Object.keys(fields).filter(f => (
    whiteList.indexOf(fields[f].toLowerCase()) !== -1 && blackList.indexOf(f.toLowerCase()) === -1
  ));

  // pivot has synthetic columns, so order them alphabetically for display in the legend
  if (pivot && pivot.pivotView && pivot.pivotView.dimensionField) {
    return filteredChartFields.sort((a, b) => a.localeCompare(b));
  } else {
    return filteredChartFields;
  }
}

export const determineFormat = (fields, dataTypes) => {
  const isPercentage = fields.every(f => (dataTypes[f].toLowerCase() === 'percentage'));
  const isCurrency = fields.every(f => (dataTypes[f].toLowerCase() === 'currency'));
  return isPercentage ? 'RATE' : isCurrency;
}

export const dataTableChartNotesText = 'To optimize display performance, this chart represents data'
  + ' points for the first record of each month plus the latest available record. The complete set'
  + ' of data points for this date range can be found under the Table tab and are available through'
  + ' the API endpoint for this data table.';

const DatasetChart = ({
  data,
  slug,
  currentTable,
  isVisible,
  legend,
  selectedPivot,
  dateField,
  dateRange
}) => {
  const [chartFields, setChartFields] = useState([]);
  const [chartNotes, setChartNotes] = useState(null);

  const viz = useRef();

  const buildLegendConfig = (fields) => {
    if (chartFields.length === 0 && fields.length !== 0) {
      setChartFields(fields.map(f => {
        return {
          field: f,
          active: true,
          label: data.meta.labels[f]
        }
      }))
    }
  }

  useEffect(() => {
    chartHooks = undefined;
  }, [data]);

  useEffect(() => {
    // There might be more chart notes in the future;
    // but, for now we only have notes for Debt to the Penny.
    // TODO: remove hard-coded dataset names
    if (slug && (
        slug.indexOf('debt-to-the-penny') !== -1 ||
        slug.indexOf('qtcb-historical-interest-rates') !== -1
      ) && !currentTable.isLargeDataset
    ) {
      const note = (
        <div className={info}>
          <FontAwesomeIcon className={icon} icon={faInfoCircle} />
          {dataTableChartNotesText}
        </div>
      );
      setChartNotes(note);
    } else {
      setChartNotes(null);
    }
  }, []);

  useEffect(() => {
    if (chartHooks && isVisible) {
      chartHooks.onUpdateChartWidth(viz.current, getVisibleChartFields(chartFields))
    }
  }, [legend, window.innerWidth]);

  useEffect(() => {
    if (chartHooks && isVisible) {
      const activeChartFields = getActiveChartFields(chartFields);
      chartHooks.onUpdateChartWidth(viz.current, chartFields.map(f => f.field),
        activeChartFields.map(f => f.field));
      callbacks.onLabelChange(activeChartFields, chartFields, setChartFields);
    }
  }, [isVisible]);

  useEffect(() => {
    let localChartFields;

    if (isVisible && data && data.meta && !chartHooks) {
      localChartFields = setFieldsToChart(
        data.meta.dataTypes,
        selectedPivot,
        dateField
      );

      buildLegendConfig(localChartFields);
      const aggFieldName = Object.keys(data.meta.dataTypes)
        .find(f => data.meta.dataTypes[f] === 'AGGREGATION_DATE');

      const chartData = thinDataAsNeededForChart(
        data.data,
        slug,
        dateField,
        currentTable
      );

      chartHooks = drawChart(
        chartData,
        viz.current,
        dateField,
        localChartFields,
        data.meta.labels,
        {
          format: determineFormat(localChartFields, data.meta.dataTypes),
          toolTipDateKey: aggFieldName || false
        }
      );
    }
  }, [isVisible, data]);

  const getVisibleChartFields = (arr) =>
    arr.filter(f => f.active).map(ff => ff.field);

  const getActiveChartFields = (arr) => arr.filter(f => f.active);


  return (
    <div className={`${chartArea} ${legend ? legendActive : ''}`}>
      <div className={chartPane}>
        <div className={chartLegendWrapper}>
          <div className={vizClass}>
            {chartNotes}
            <h4 className={datasetStats}>
              {data &&
                `${getYear(dateRange.from)} - ${getYear(dateRange.to)}`
              }
              {selectedPivot &&
                selectedPivot.pivotView ? ` | ${selectedPivot.pivotView.title}` : ''
              }
            </h4>
            <div id="viz" ref={viz} />
            <ChartCitation slug={slug} currentTableName={currentTable.tableName} />
          </div>
          <div className={legendClass}>
            <ChartLegend
              isVisible={isVisible}
              fields={chartFields}
              // If onHover is set to {callbacks.onHover}, then Jest can't tell onHover was fired.
              onHover={(on, item) => callbacks.onHover(on, item)}
              onLabelChange={(update) =>
                callbacks.onLabelChange(update, chartFields, setChartFields)}
            />
          </div>
        </div>
      </div>
    </div>
  )
};

export default DatasetChart;
