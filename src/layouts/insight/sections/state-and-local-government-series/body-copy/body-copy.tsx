import React, { ReactElement, useEffect, useState } from 'react';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { format } from 'date-fns';
import { getDateWithoutTimeZoneAdjust } from '../../../../../utils/date-utils';
import { getShortForm } from '../../../../../utils/rounding-utils';
import GlossaryPopoverDefinition from '../../../../../components/glossary/glossary-term/glossary-popover-definition';
import { ga4DataLayerPush } from '../../../../../helpers/google-analytics/google-analytics-helper';
import { analyticsEventHandler } from '../../../../../helpers/insights/insight-helpers';

const BodyCopy = (): ReactElement => {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [slgsTotal, setSlgsTotal] = useState(null);
  const [totalDebtOutstanding, setTotalDebtOutstanding] = useState(null);

  useEffect(() => {
    basicFetch(`${apiPrefix}v2/accounting/od/debt_to_penny?sort=-record_date`).then(res => {
      if (res.data && res.data.length > 0) {
        const lastUpdatedDate = res.data[0].record_date;
        const formattedDate = format(getDateWithoutTimeZoneAdjust(lastUpdatedDate), 'MMMM d, yyyy');
        setLastUpdated(formattedDate);

        basicFetch(`${apiPrefix}v2/accounting/od/debt_to_penny?filter=record_date:eq:${lastUpdatedDate}`).then(resTotal => {
          if (resTotal.data && resTotal.data.length > 0) {
            const totalDebtHeld = resTotal.data[0]['tot_pub_debt_out_amt'];
            setTotalDebtOutstanding(totalDebtHeld);
          }
        });

        const endpoint = 'v1/accounting/od/slgs_securities';
        const fields =
          'record_date,outstanding_0_3_mos_cnt,outstanding_0_3_mos_amt,outstanding_3_6_mos_cnt,outstanding_3_6_mos_amt,' +
          'outstanding_6_mos_to_2_yrs_cnt,outstanding_6_mos_to_2_yrs_amt,outstanding_2_5_yrs_cnt,outstanding_2_5_yrs_amt,outstanding_5_10_yrs_cnt,' +
          'outstanding_5_10_yrs_amt,outstanding_over_10_yrs_cnt,outstanding_over_10_yrs_amt';

        basicFetch(`${apiPrefix}${endpoint}?fields=${fields}&filter=record_date:eq:${lastUpdatedDate}&sort=-record_date`).then(resSum => {
          if (resSum.data && resSum.data.length > 0) {
            const slgsTotalSum =
              parseFloat(resSum.data[0]['outstanding_0_3_mos_amt']) +
              parseFloat(resSum.data[0]['outstanding_3_6_mos_amt']) +
              parseFloat(resSum.data[0]['outstanding_6_mos_to_2_yrs_amt']) +
              parseFloat(resSum.data[0]['outstanding_2_5_yrs_amt']) +
              parseFloat(resSum.data[0]['outstanding_5_10_yrs_amt']) +
              parseFloat(resSum.data[0]['outstanding_over_10_yrs_amt']);
            setSlgsTotal(slgsTotalSum);
          }
        });
      }
    });
  }, []);

  const percentCalc = (slgsTotal, totalDebtOutstanding) => {
    const num = (slgsTotal / totalDebtOutstanding) * 100;
    return Math.round(num * 100) / 100;
  };

  const glossaryGAEvent = term => {
    analyticsEventHandler('State and Local Government Series', term, 'Glossary Term Click');
    ga4DataLayerPush({
      event: `Glossary Term Click`,
      eventLabel: term,
    });
  };

  const totalPublicDebtOutstanding = (
    <GlossaryPopoverDefinition
      term="Total Public Debt Outstanding"
      page="State and Local Government Series Insight"
      handleClick={() => glossaryGAEvent('Total Public Debt Outstanding')}
    >
      total public debt outstanding
    </GlossaryPopoverDefinition>
  );

  const stateAndLocalGovernmentSeries = (
    <GlossaryPopoverDefinition
      term="State and Local Government Series"
      page="State and Local Government Series Insight"
      handleClick={() => glossaryGAEvent('State and Local Government Series')}
    >
      State and Local Government Series (SLGS)
    </GlossaryPopoverDefinition>
  );

  const nonMarketableSecurities = (
    <GlossaryPopoverDefinition
      term="Non-Marketable Securities"
      page="State and Local Government Series Insight"
      handleClick={() => glossaryGAEvent('Non-Marketable Securities')}
    >
      non-marketable securities
    </GlossaryPopoverDefinition>
  );

  const federalDebt = (
    <GlossaryPopoverDefinition
      term="Federal Debt"
      page="State and Local Government Series Insight"
      handleClick={() => glossaryGAEvent('Federal Debt')}
    >
      federal debt
    </GlossaryPopoverDefinition>
  );

  const treasurySecurity = (
    <GlossaryPopoverDefinition
      term="Treasury Security"
      page="State and Local Government Series Insight"
      handleClick={() => glossaryGAEvent('Treasury Securities')}
    >
      treasury securities
    </GlossaryPopoverDefinition>
  );

  return (
    <div>
      {stateAndLocalGovernmentSeries} are {nonMarketableSecurities} that exist to help state and local governments meet their financing needs while
      remaining in accordance with Internal Revenue Service (IRS) law. For example, if a city issues municipal bonds to pay for a new elementary
      school, there may be a delay between when the funds are acquired through the bond sales and when the city must pay the bills to build the
      school. As a result, state and local governments will invest these funds. The IRS has strict guidelines about how state and local governments
      can invest these funds to ensure they're used properly. SLGS securities are an attractive option because they make it easier to comply with IRS
      regulations. SLGS also serve the federal government as a means of financing the {federalDebt}, similar to other {treasurySecurity}. As of{' '}
      {lastUpdated}, there are ${getShortForm(slgsTotal, true)} outstanding SLGS securities, {percentCalc(slgsTotal, totalDebtOutstanding)} percent of
      the {totalPublicDebtOutstanding}.
    </div>
  );
};

export default BodyCopy;
