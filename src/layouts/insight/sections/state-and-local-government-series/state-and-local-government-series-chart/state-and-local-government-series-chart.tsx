import React, { useState } from 'react';
import ChartDataHeader from '../../../../explainer/explainer-components/chart-data-header/chart-data-header';
import { ChartTableContainer } from '../../../../../components/chart-with-table/chart-table-container/chart-table-container';
import ChartingTableToggle from '../../../../../components/chart-with-table/chart-table-toggle/charting-table-toggle';
import { faChartColumn, faTable } from '@fortawesome/free-solid-svg-icons';
import DtgTable from '../../../../../components/dtg-table/dtg-table';
import { Legend } from './state-and-local-government-series-chart-helper';

export const StateAndLocalGovernmentSeriesChart = () => {
  const [selectedChartView, setSelectedChartView] = useState<string>('chartView');

  const chartTitle = `Outstanding State and Local Government Series (SLGS) Securities`;
  const toggle = (
    <ChartingTableToggle
      primaryColor={'#0071BC'}
      leftButtonConfig={{
        leftId: 'chartView',
        leftSelected: selectedChartView === 'chartView',
      }}
      rightButtonConfig={{
        rightId: 'tableView',
        rightSelected: selectedChartView === 'tableView',
      }}
      toggleClickHandler={(chartView: string) => setSelectedChartView(chartView)}
      chartId={null}
      leftIcon={faChartColumn}
      rightIcon={faTable}
      leftLabel={'toggle for chart view'}
      rightLabel={'toggle for table view'}
    />
  );

  return (
    <>
      <ChartTableContainer title={chartTitle} toggle={toggle}>
        {selectedChartView === 'chartView' && (
          <div>
            <ChartDataHeader dateField={'Date'} fiscalYear={'p1'} right={{ label: 'Amount', value: `p2` }} left={{ label: 'Count', value: `p3` }} />
          </div>
        )}
        <div>
          {/*TODO: alter size on light blue legend square*/}
          <Legend />
        </div>

        {/*{selectedChartView === 'tableView' && <DtgTable />}*/}
      </ChartTableContainer>
    </>
  );
};
