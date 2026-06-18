import React, { ReactElement } from 'react';
import { featuredContentCitationsMap } from '../../featured-content-helpers';

export const HistoricDataNowAvailableBody = (): ReactElement => {
  const accountsOfReceiptsAndExpendituresDataset = featuredContentCitationsMap['historic-data-announcement'];

  return (
    <div>
      <p>
        This release consolidates centuries of federal financial information from multiple sources into one modern, accessible platform, providing a
        more complete and centralized view of the nation’s fiscal history.{' '}
      </p>
      <p>
        This milestone provides insight into federal receipts and expenditures data from 1793 onward, including Treasury's{' '}
        {accountsOfReceiptsAndExpendituresDataset} (1793–1890) and the Combined Statement of Receipts, Outlays, and Balances (1872–2025). Together,
        these records offer a comprehensive picture of America's finances spanning more than 230 years.{' '}
      </p>
    </div>
  );
};
