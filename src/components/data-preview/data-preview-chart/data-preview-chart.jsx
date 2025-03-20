import React, { useEffect, useState, useRef } from 'react';
import drawChart from '../../charts/chart-primary';
import ChartLegend from '../../charts/chart-legend/chartLegend';
import { thinDataAsNeededForChart } from '../../dataset-data/dataset-data-helper/dataset-data-helper';
import {
  info,
  icon,
  chartArea,
  legendActive,
  chartPane,
  chartLegendWrapper,
  viz as vizClass,
  legend as legendClass,
  yAxisLabel,
  labelContainer,
} from './data-preview-chart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export let chartHooks;
export const callbacks = {
  onHover: (on, item, hasUpdates, chartFields) => {
    const isActiveField = chartFields.some(field => field.field === item.field && field.active);
    if (isActiveField && chartHooks.onHover && hasUpdates) {
      chartHooks.onHover(on, item.field);
    }
  },
  onLabelChange: (update, chartFields, setChartFields) => {
    if (!(chartFields && setChartFields && chartHooks.onFieldUpdates)) {
      return;
    }

    const selectedFields = update.map(r => r.field);

    chartFields.forEach(r => {
      r.active = selectedFields.indexOf(r.field) !== -1;
    });

    chartHooks.onFieldUpdates(selectedFields);
    setChartFields(chartFields.slice());
  },
};

export const setFieldsToChart = (fields, pivot) => {
  const whiteList = ['currency', 'number', 'percentage'];
  const blackList = ['src_line_nbr', 'table_nbr', 'total_incoming_transfers_cnt', 'from_legacy_system_cnt', 'from_commercial_book_entry_cnt'];
  const filteredChartFields = Object.keys(fields).filter(
    f =>
      (whiteList.indexOf(fields[f].toLowerCase()) !== -1 || whiteList.indexOf(fields[f].substring(0, 8).toLowerCase()) !== -1) &&
      blackList.indexOf(f.toLowerCase()) === -1
  );
  // pivot has synthetic columns, so order them alphabetically for display in the legend
  if (pivot && pivot.pivotView && pivot.pivotView.dimensionField) {
    return filteredChartFields.sort((a, b) => a.localeCompare(b));
  } else {
    return filteredChartFields;
  }
};

export const determineFormat = (fields, dataTypes) => {
  const isPercentage = fields.every(f => dataTypes[f].toLowerCase() === 'percentage');
  const isCurrency = fields.every(f => dataTypes[f].toLowerCase() === 'currency' || dataTypes[f].substring(0, 8).toLowerCase() === 'currency');
  return isPercentage ? 'RATE' : isCurrency;
};

export const dataTableChartNotesText =
  'To optimize display performance, this chart represents data' +
  ' points for the first record of each month plus the latest available record. The complete set' +
  ' of data points for this date range can be found under the Table tab and are available through' +
  ' the API endpoint for this data table.';

const DataPreviewChart = ({ data, slug, currentTable, isVisible, legend, selectedPivot, dateField, dateRange, chartCitation }) => {
  const [chartFields, setChartFields] = useState([]);
  const [chartNotes, setChartNotes] = useState(null);
  const [hasUpdate, setHasUpdate] = useState(true);
  const [capitalized, setCapitalized] = useState('');
  const [axisHasBillions, setAxisHasBillions] = useState(false);

  const viz = useRef();

  const buildLegendConfig = fields => {
    if (chartFields.length === 0 && fields.length !== 0) {
      setChartFields(
        fields.map(f => {
          return {
            field: f,
            active: true,
            label: data.meta.labels[f],
          };
        })
      );
    }
  };

  useEffect(() => {
    chartHooks = undefined;
  }, [data]);

  useEffect(() => {
    // There might be more chart notes in the future;
    // but, for now we only have notes for Debt to the Penny.
    // TODO: remove hard-coded dataset names
    if (slug && (slug.indexOf('debt-to-the-penny') !== -1 || slug.indexOf('qtcb-historical-interest-rates') !== -1) && !currentTable.isLargeDataset) {
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
  const getVisibleChartFields = arr => arr.filter(f => f.active).map(ff => ff.field);
  const getActiveChartFields = arr => arr.filter(f => f.active);
  const activeChartFields = getActiveChartFields(chartFields);
  useEffect(() => {
    if (chartHooks && isVisible) {
      chartHooks.onUpdateChartWidth(viz.current, activeChartFields, getVisibleChartFields(chartFields));
    }
  }, [legend, window.innerWidth]);

  useEffect(() => {
    if (chartHooks && isVisible) {
      const nonActiveChartFields = getVisibleChartFields(chartFields);
      chartHooks.onUpdateChartWidth(
        viz.current,
        nonActiveChartFields.map(f => f.field),
        activeChartFields.map(f => f.field)
      );
      callbacks.onLabelChange(activeChartFields, chartFields, setChartFields);
    }
  }, [isVisible]);

  const determineIfAxisWillHaveBillions = data => {
    const valueArrays = data.map(v => Object.values(v));
    const filtered = valueArrays.map(v => v.filter(e => !isNaN(Number(e))));
    const values = Array.prototype.concat.call(...filtered);
    const max = Math.max(...values);
    return max >= 1000000000;
  };

  useEffect(() => {
    let localChartFields;

    if (isVisible && data && data.meta && !chartHooks) {
      localChartFields = setFieldsToChart(data.meta.dataTypes, selectedPivot, dateField);

      buildLegendConfig(localChartFields);
      const aggFieldName = Object.keys(data.meta.dataTypes).find(f => data.meta.dataTypes[f] === 'AGGREGATION_DATE');

      const chartData = thinDataAsNeededForChart(data.data, slug, dateField, currentTable);

      if (chartData.length > 0 && localChartFields.length > 0) {
        setAxisHasBillions(determineIfAxisWillHaveBillions(chartData));
        chartHooks = drawChart(
          chartData,
          viz.current,
          dateField,
          localChartFields,
          data.meta.labels,
          selectedPivot ? selectedPivot.pivotView.roundingDenomination : null,
          {
            format: determineFormat(localChartFields, data.meta.dataTypes),
            toolTipDateKey: aggFieldName || false,
          }
        );
      }
    }
  }, [isVisible, data]);

  const handleLabelChange = update => {
    setHasUpdate(update.length > 0);
    callbacks.onLabelChange(update, chartFields, setChartFields);
  };

  useEffect(() => {
    if (selectedPivot && selectedPivot.pivotView?.roundingDenomination) {
      setCapitalized(selectedPivot.pivotView?.roundingDenomination.charAt(0).toUpperCase() + selectedPivot.pivotView.roundingDenomination.slice(1));
    }
  }, [selectedPivot]);

  return (
    <div className={`${chartArea} ${legend ? legendActive : ''}`}>
      <div className={chartPane}>
        <div className={chartLegendWrapper}>
          <div className={vizClass}>
            {chartNotes}
            {selectedPivot && selectedPivot.pivotView?.roundingDenomination && (
              <div className={labelContainer}>
                <div style={{ left: axisHasBillions && '-3rem' }} className={yAxisLabel}>
                  {capitalized}
                </div>
              </div>
            )}
            <div id="viz" ref={viz} />
          </div>
          <div className={legendClass}>
            <ChartLegend
              isVisible={isVisible}
              fields={chartFields}
              // If onHover is set to {callbacks.onHover}, then Jest can't tell onHover was fired.
              onHover={(on, item) => callbacks.onHover(on, item, hasUpdate, chartFields)}
              onLabelChange={handleLabelChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPreviewChart;
