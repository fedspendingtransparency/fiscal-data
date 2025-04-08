import React, { FunctionComponent } from 'react';
import { toolTip, tooltipLabel, box, labelContainer, valueContainer } from './custom-tooltip.module.scss';
import { savingsBonds, savingsBondsMap, yAxisFormatter } from '../savings-bonds-sold-by-type-chart-helper';
import { analyticsEventHandler } from '../../../../../explainer-helpers/explainer-helpers';
import globalConstants from '../../../../../../../helpers/constants';
import { ga4DataLayerPush } from '../../../../../../../helpers/google-analytics/google-analytics-helper';

interface IPayload {
  payload: {
    year: string;
  };
}

interface ICustomTooltip {
  label?: string;
  payload?: IPayload[];
  hiddenFields?: string[];
}

let gaTimer;

const CustomTooltip: FunctionComponent<ICustomTooltip> = ({ payload, label, hiddenFields }) => {
  const { explainers } = globalConstants;

  const handleChartMouseEnter = () => {
    const eventLabel = 'Savings Bonds - Additional Inflation Adjustment Info';
    const eventAction = 'Additional Info Hover';
    gaTimer = setTimeout(() => {
      analyticsEventHandler(eventLabel, eventAction);
      ga4DataLayerPush({
        event: eventAction,
        eventLabel: eventLabel,
      });
    }, explainers.chartHoverDelay);
  };

  const handleChartMouseLeave = () => {
    clearTimeout(gaTimer);
  };

  if (payload && payload.length) {
    const content = payload[0]?.payload;
    return (
      <div
        className={toolTip}
        data-testid="CustomTooltip"
        onMouseEnter={handleChartMouseEnter}
        onMouseLeave={handleChartMouseLeave}
        role="presentation"
      >
        <div className={tooltipLabel}>{label}</div>
        {savingsBonds
          .filter(id => !hiddenFields.includes(id))
          .map((id, index) => {
            const value = content[id];
            const label = savingsBondsMap[id].label;
            const displayValue = `${yAxisFormatter(parseFloat(value))}`;
            if (value) {
              return (
                <div className={valueContainer} key={index}>
                  <div className={labelContainer}>
                    <span className={box} style={{ backgroundColor: savingsBondsMap[id].color }} />
                    <span className={tooltipLabel}>{label}</span>
                  </div>
                  <span>{displayValue}</span>
                </div>
              );
            }
            return null;
          })}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
