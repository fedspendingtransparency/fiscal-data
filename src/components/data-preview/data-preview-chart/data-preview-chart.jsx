import React, { useContext, useEffect, useRef, useState } from 'react';
import drawChart from '../../charts/chart-primary';
import ChartLegend from './chart-legend/chart-legend';
import { thinDataAsNeededForChart } from '../../dataset-data/dataset-data-helper/dataset-data-helper';
import {
  billionsLabel,
  chartArea,
  chartLegendWrapper,
  chartPane,
  footerLegendWrapper,
  icon,
  info,
  labelContainer,
  legend as legendClass,
  legendActive,
  legendToggle,
  panelLegendWrapper,
  viz as vizClass,
  yAxisLabel,
} from './data-preview-chart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ChartLegendPanel from './chart-legend-panel/chart-legend-panel';
import {
  callbacks,
  dataTableChartNotesText,
  determineFormat,
  determineIfAxisWillHaveBillions,
  getActiveChartFields,
  getVisibleChartFields,
  legendColors,
  setFieldsToChart,
} from './chart-helper';
import ChartCitation from '../../dataset-data/dataset-chart/chart-citation/chart-citation';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { DataTableContext } from '../data-preview-context';

export let chartHooks;

const DataPreviewChart = ({ data, slug, currentTable, selectedPivot, dateField }) => {
  const { tableState: table } = useContext(DataTableContext);

  const [chartFields, setChartFields] = useState([]);
  const [chartNotes, setChartNotes] = useState(null);
  const [hasUpdate, setHasUpdate] = useState(true);
  const [capitalized, setCapitalized] = useState('');
  const [axisHasBillions, setAxisHasBillions] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const viz = useRef();
  const [colorMap, setColorMap] = useState({});
  const columns = table?.getVisibleFlatColumns();
  const buildLegendConfig = fields => {
    setChartFields(
      fields.map(f => {
        return {
          field: f,
          active: columns ? columns.filter(x => x.id === f).length > 0 : true,
          label: data.meta.labels[f],
        };
      })
    );
  };

  const handleLabelChange = update => {
    setHasUpdate(update.length > 0);
    callbacks.onLabelChange(update, chartFields, setChartFields);
  };

  useEffect(() => {
    chartHooks = undefined;
  }, [data, table?.getVisibleFlatColumns()]);

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

  const activeChartFields = getActiveChartFields(chartFields);

  useEffect(() => {
    if (chartHooks) {
      chartHooks.onUpdateChartWidth(viz.current, activeChartFields, getVisibleChartFields(chartFields));
    }
  }, [showLegend, window.innerWidth]);

  useEffect(() => {
    if (chartHooks) {
      const nonActiveChartFields = getVisibleChartFields(chartFields);
      chartHooks.onUpdateChartWidth(
        viz.current,
        nonActiveChartFields.map(f => f.field),
        activeChartFields.map(f => f.field)
      );
      callbacks.onLabelChange(activeChartFields, chartFields, setChartFields);
    }
  }, [chartHooks]);

  useEffect(() => {
    let localChartFields;
    if (data && data.meta && !chartHooks) {
      localChartFields = setFieldsToChart(data.meta.dataTypes, selectedPivot, dateField);
      const fieldColors = {};
      localChartFields.forEach((f, i) => {
        fieldColors[f] = legendColors[i % legendColors.length];
      });
      setColorMap(fieldColors);

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
            fieldColors: fieldColors,
          }
        );
      }
    }
  }, [data, table?.getVisibleFlatColumns()]);

  useEffect(() => {
    if (selectedPivot && selectedPivot.pivotView?.roundingDenomination) {
      setCapitalized(selectedPivot.pivotView?.roundingDenomination.charAt(0).toUpperCase() + selectedPivot.pivotView.roundingDenomination.slice(1));
    }
  }, [selectedPivot]);

  return (
    <div className={`${chartArea} ${chartFields.length <= 12 || !showLegend ? undefined : legendActive}`}>
      <div className={chartPane}>
        <div className={`${chartLegendWrapper} ${chartFields.length <= 12 ? footerLegendWrapper : panelLegendWrapper}`}>
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
              <button className={legendToggle} onClick={() => setShowLegend(!showLegend)} aria-label={`${showLegend ? 'Hide' : 'Show'} Legend`}>
                {showLegend ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </button>
              <div className={legendClass}>
                <ChartLegendPanel
                  fields={chartFields}
                  // If onHover is set to {callbacks.onHover}, then Jest can't tell onHover was fired.
                  onHover={(on, item) => callbacks.onHover(on, item, hasUpdate, chartFields)}
                  onLabelChange={handleLabelChange}
                  legendVisibility={showLegend}
                  legendColors={colorMap}
                />
              </div>
            </>
          ) : (
            <ChartLegend
              fields={chartFields}
              // If onHover is set to {callbacks.onHover}, then Jest can't tell onHover was fired.
              onHover={(on, item) => callbacks.onHover(on, item, hasUpdate, chartFields)}
              onLabelChange={handleLabelChange}
              legendColors={colorMap}
            />
          )}
          {chartFields.length <= 12 && <ChartCitation slug={slug} currentTableName={currentTable.tableName} />}
        </div>
      </div>
    </div>
  );
};

export default DataPreviewChart;
