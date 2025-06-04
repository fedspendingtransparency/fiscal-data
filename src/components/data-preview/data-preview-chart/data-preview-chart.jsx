import React, { useEffect, useRef, useState } from 'react';
import drawChart from '../../charts/chart-primary';
import ChartLegend from './chart-legend/chart-legend';
import { thinDataAsNeededForChart } from '../../dataset-data/dataset-data-helper/dataset-data-helper';
import {
  billionsLabel,
  chartArea,
  chartLegendWrapper,
  chartPane,
  icon,
  info,
  labelContainer,
  legend as legendClass,
  legendActive,
  legendToggle,
  viz as vizClass,
  yAxisLabel,
} from './data-preview-chart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ChartLegendPanel from './chart-legend-panel/chart-legend-panel';
import { callbacks, dataTableChartNotesText, determineFormat, setFieldsToChart } from './chart-helper';
import ChartCitation from '../../dataset-data/dataset-chart/chart-citation/chart-citation';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export let chartHooks;

/*
TODO
- data props
- legend button
- style footer buttons
- legend panel height
 */

const DataPreviewChart = ({ data, slug, currentTable, legend, selectedPivot, dateField }) => {
  const [chartFields, setChartFields] = useState([]);
  const [chartNotes, setChartNotes] = useState(null);
  const [hasUpdate, setHasUpdate] = useState(true);
  const [capitalized, setCapitalized] = useState('');
  const [axisHasBillions, setAxisHasBillions] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
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
    if (chartHooks) {
      console.log('here');
      chartHooks.onUpdateChartWidth(viz.current, activeChartFields, getVisibleChartFields(chartFields));
    }
  }, [showLegend, window.innerWidth]);

  useEffect(() => {
    if (chartHooks) {
      console.log('here 2');
      const nonActiveChartFields = getVisibleChartFields(chartFields);
      chartHooks.onUpdateChartWidth(
        viz.current,
        nonActiveChartFields.map(f => f.field),
        activeChartFields.map(f => f.field)
      );
      callbacks.onLabelChange(activeChartFields, chartFields, setChartFields);
    }
  }, [chartHooks]);

  const determineIfAxisWillHaveBillions = data => {
    const valueArrays = data.map(v => Object.values(v));
    const filtered = valueArrays.map(v => v.filter(e => !isNaN(Number(e))));
    const values = Array.prototype.concat.call(...filtered);
    const max = Math.max(...values);
    return max >= 1000000000;
  };

  useEffect(() => {
    let localChartFields;

    if (data && data.meta && !chartHooks) {
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
  }, [data]);

  const handleLabelChange = update => {
    setHasUpdate(update.length > 0);
    callbacks.onLabelChange(update, chartFields, setChartFields);
  };

  useEffect(() => {
    if (selectedPivot && selectedPivot.pivotView?.roundingDenomination) {
      setCapitalized(selectedPivot.pivotView?.roundingDenomination.charAt(0).toUpperCase() + selectedPivot.pivotView.roundingDenomination.slice(1));
    }
  }, [selectedPivot]);
  ////${legend ? legendActive : ''}`}>
  return (
    <div className={`${chartArea} ${chartFields.length <= 12 || !showLegend ? undefined : legendActive}`}>
      <div className={chartPane}>
        <div className={chartLegendWrapper} style={chartFields.length <= 12 ? { flexDirection: 'column' } : { flexDirection: 'row' }}>
          <div className={vizClass}>
            {chartNotes}
            {selectedPivot && selectedPivot.pivotView?.roundingDenomination && (
              <div className={labelContainer}>
                <div className={`${yAxisLabel} ${axisHasBillions ? billionsLabel : undefined}`}>{capitalized}</div>
              </div>
            )}
            <div id="viz" ref={viz} />
            {chartFields.length > 13 && <ChartCitation slug={slug} currentTableName={currentTable.tableName} />}
          </div>
          {chartFields.length > 12 ? (
            <>
              <button className={legendToggle} onClick={() => setShowLegend(!showLegend)}>
                {showLegend ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </button>
              <div className={legendClass}>
                <ChartLegendPanel
                  fields={chartFields}
                  // If onHover is set to {callbacks.onHover}, then Jest can't tell onHover was fired.
                  onHover={(on, item) => callbacks.onHover(on, item, hasUpdate, chartFields)}
                  onLabelChange={handleLabelChange}
                  legendVisibility={showLegend}
                />
              </div>
            </>
          ) : (
            <ChartLegend
              fields={chartFields}
              // If onHover is set to {callbacks.onHover}, then Jest can't tell onHover was fired.
              onHover={(on, item) => callbacks.onHover(on, item, hasUpdate, chartFields)}
              onLabelChange={handleLabelChange}
            />
          )}
          {chartFields.length <= 12 && <ChartCitation slug={slug} currentTableName={currentTable.tableName} />}
        </div>
      </div>
    </div>
  );
};

export default DataPreviewChart;
