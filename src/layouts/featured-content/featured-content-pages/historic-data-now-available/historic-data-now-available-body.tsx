import React, { ReactElement } from 'react';
import { featuredContentCitationsMap } from '../../featured-content-helpers';
import { line } from './historic-data-now-available-body.module.scss';

export const HistoricDataNowAvailableBody = (): ReactElement => {
  const { accountsOfReceiptsAndExpendituresDataset, combinedStatementDataset } = featuredContentCitationsMap['historic-data-announcement'];

  return (
    <div>
      <p>
        This release consolidates centuries of federal financial information from multiple sources into one modern, accessible platform, providing a
        more complete and centralized view of the nation’s fiscal history.{' '}
      </p>
      <p>
        This milestone provides insight into federal receipts and expenditures data from 1793 onward, including Treasury's{' '}
        {accountsOfReceiptsAndExpendituresDataset} (1793–1890) and the {combinedStatementDataset} (1872–2025). Together, these records offer a
        comprehensive picture of America's finances spanning more than 230 years.{' '}
      </p>
      <p>
        This release offers an unprecedented view of government revenue collection and spending since the nation's founding. It enables analysis of an
        extensive historical archive of receipts and revenue data. By consolidating and modernizing access to this information, the Bureau of the
        Fiscal Service reinforces its dedication to transparency, accountability, and open data access. With this new data, users could explore:{' '}
      </p>
      <div className={line}></div>
      <p>
        U.S. government cash and liquidity management by analyzing all daily, monthly, or annual cash balances, receipts, and outlays to identify
        seasonal patterns, volatility, and periods of surplus or shortfall.{' '}
      </p>
      <div className={line}></div>
      <p>
        Spending trends and policy impact by extracting all outlay categories and amounts to compute growth rates, shares of total spending, and
        long-term trends.{' '}
      </p>
      <div className={line}></div>
      <p>
        Crisis response and fiscal resilience by identifying periods of significant spikes or changes in receipts and outlays and comparing the
        magnitude, composition, and duration of fiscal changes.{' '}
      </p>
      <div className={line}></div>
      <p>
        Released ahead of the nation's 250th anniversary, these datasets provide a valuable resource for understanding the financial foundations that
        have shaped the United States since 1793.{' '}
      </p>
    </div>
  );
};
