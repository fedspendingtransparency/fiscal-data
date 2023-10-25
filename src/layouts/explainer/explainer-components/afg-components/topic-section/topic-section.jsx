import AfgTopicCard from '../afg-topic-card/afg-topic-card';
import React, { useEffect, useState } from 'react';
import GlossaryPopoverDefinition from '../../../../../components/glossary/glossary-term/glossary-popover-definition';
import { getAFGFootnotes } from '../../../../../helpers/footnotes-helper/footnotes-helper';
import AnchorText from '../../../../../components/anchor-text/anchor-text';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import ApiRequest from '../../../../../helpers/api-request';
import {
  debtRequest,
  deficitRequest,
  revenueCategoryRequest,
  revenueRequest,
  spendingCategoryRequest,
  spendingRequest,
} from '../../../explainer-helpers/afg-overview-helpers';
import { getShortForm } from '../../../../../utils/rounding-utils';

const TopicSection = ({ glossary, fiscalYear, setGlossaryClickEvent }) => {
  const [fytdRevenue, setFytdRevenue] = useState('');
  const [priorFyRevenue, setPriorFyRevenue] = useState('');
  const [revenueCategory, setRevenueCategory] = useState('');
  const [fytdSpending, setFytdSpending] = useState('');
  const [priorFySpending, setPriorFySpending] = useState('');
  const [spendingCategory, setSpendingCategory] = useState('');
  const [fytdDeficit, setFytdDeficit] = useState('');
  const [priorFyDeficit, setPriorFyDeficit] = useState('');
  const [deficitChange, setDeficitChange] = useState('');
  const [deficitDirection, setDeficitDirection] = useState('');
  const [debt, setDebt] = useState('');
  const [priorFyDebt, setPriorFyDebt] = useState('');
  const [latestDebt, setLatestDebt] = useState('');
  const [revenueHas, setRevenueHas] = useState('has collected');
  const [spendingHas, setSpendingHas] = useState('has');
  const [deficitExceeds, setDeficitExceeds] = useState('exceeds');
  const [debtContributed, setDebtContributed] = useState('has contributed');
  const [debtDate, setDebtDate] = useState('month year');
  const [debtToPennyDate, setDebtToPennyDate] = useState('month DD, year');
  const [debtChange, setDebtChange] = useState('');
  const [debtDirection, setDebtDirection] = useState('');

  const priorFiscalYear = (Number(fiscalYear) - 1).toString();
  const priorPriorYear = (Number(fiscalYear) - 2).toString();
  const priorRevenueRequest = new ApiRequest(revenueRequest).forEndOfFiscalYear(priorFiscalYear);
  const priorRevenueCategoryRequest = new ApiRequest(revenueCategoryRequest).forEndOfFiscalYear(priorFiscalYear);
  const priorSpendingRequest = new ApiRequest(spendingRequest).forEndOfFiscalYear(priorFiscalYear);
  const priorSpendingCategoryRequest = new ApiRequest(spendingCategoryRequest).forEndOfFiscalYear(priorFiscalYear);
  const priorDeficitRequest = new ApiRequest(deficitRequest).forEndOfFiscalYear(priorFiscalYear);
  const priorDebtRequest = new ApiRequest(debtRequest).forEndOfFiscalYear(priorFiscalYear);
  const priorPriorDebtRequest = new ApiRequest(debtRequest).forEndOfFiscalYear(priorPriorYear);

  const mtsDebtEndpoint = 'v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694&sort=-record_date&page[size]=1';

  useEffect(async () => {
    const category = await basicFetch(priorRevenueCategoryRequest.getUrl()).then(res => {
      if (res.data && res.data.length > 0) {
        return res.data[0].classification_desc;
      }
    });
    setRevenueCategory(category);
  }, []);

  useEffect(() => {
    basicFetch(new ApiRequest(revenueRequest).getUrl()).then(res => {
      if (res.data) {
        const data = res.data[0];
        setFytdRevenue(getShortForm(data.current_fytd_net_rcpt_amt.toString(), false));
        if (data.record_calendar_month === '09') {
          setRevenueHas('collected');
        }
      }
    });
    basicFetch(priorRevenueRequest.getUrl()).then(res => {
      if (res.data) {
        console.log(res);
        const data = res.data[0];
        setPriorFyRevenue(getShortForm(data?.current_fytd_net_rcpt_amt.toString(), false));
      }
    });

    basicFetch(new ApiRequest(spendingRequest).getUrl()).then(res => {
      if (res.data) {
        const data = res.data[0];
        setFytdSpending(getShortForm(data.current_fytd_net_outly_amt.toString(), false));
        if (data.record_calendar_month === '09') {
          setSpendingHas('');
        }
      }
    });
    basicFetch(priorSpendingRequest.getUrl()).then(res => {
      if (res.data) {
        const data = res.data[0];
        setPriorFySpending(getShortForm(data.current_fytd_net_outly_amt.toString(), false));
      }
    });
    basicFetch(priorSpendingCategoryRequest.getUrl()).then(res => {
      if (res.data) {
        const data = res.data[0];
        setSpendingCategory(data?.classification_desc);
      }
    });
    basicFetch(new ApiRequest(deficitRequest).getUrl()).then(res => {
      if (res.data) {
        const data = res.data[0];
        const deficitAmount = Math.abs(Number(data.current_fytd_net_outly_amt));
        const formattedAmount = getShortForm(deficitAmount.toString(), false);
        setFytdDeficit(formattedAmount);
        if (data.record_calendar_month === '09') {
          setDeficitExceeds('exceeded');
        }
      }
    });
    basicFetch(priorDeficitRequest.getUrl()).then(res => {
      if (res.data) {
        const data = res.data[0];
        const deficitAmount = Number(data.current_fytd_net_outly_amt);
        const priorDeficitAmount = Number(data.prior_fytd_net_outly_amt);
        const formattedAmount = getShortForm(Math.abs(deficitAmount).toString(), false);
        setPriorFyDeficit(formattedAmount);
        const difference = deficitAmount - priorDeficitAmount;
        setDeficitDirection(difference < 0 ? 'increased' : 'decreased');
        const formattedChange = getShortForm(Math.abs(difference).toString(), false);
        setDeficitChange(formattedChange);
      }
    });
    basicFetch(`${apiPrefix}${mtsDebtEndpoint}`).then(res => {
      if (res.data) {
        const mtsData = res.data[0];
        const mtsMonth = mtsData.record_calendar_month;

        // eslint-disable-next-line max-len
        const mspdDebtEndpoint = `v1/debt/mspd/mspd_table_1?filter=security_type_desc:eq:Total%20Public%20Debt%20Outstanding,record_calendar_month:eq:${mtsMonth}&sort=-record_date&page[size]=1`;

        basicFetch(`${apiPrefix}${mspdDebtEndpoint}`).then(res => {
          if (res.data) {
            const mspdData = res.data.find(entry => entry.record_calendar_month === mtsData.record_calendar_month);
            if (mspdData.record_calendar_month === '09') {
              setDebtContributed('contributed');
            }
            setLatestDebt(getShortForm((mspdData.total_mil_amt * 1000000).toString(), false));
            const date = new Date(mtsData.record_date);
            const monthName = date.toLocaleString('default', { month: 'long' });
            const year = mtsData.record_calendar_year;
            setDebtDate(`${monthName} ${year}`);
          }
        });
      }
    });
    basicFetch(new ApiRequest(debtRequest).getUrl()).then(res => {
      if (res.data) {
        const data = res.data[0];
        setDebt(getShortForm(data.tot_pub_debt_out_amt.toString(), false));
        const date = new Date(data.record_date);
        const monthName = date.toLocaleString('default', { month: 'long' });
        const debtToThePennyDay = data.record_calendar_day;
        setDebtToPennyDate(`${monthName} ${debtToThePennyDay}, ${data.record_calendar_year}`);
      }
    });
    basicFetch(priorDebtRequest.getUrl()).then(res => {
      if (res.data) {
        const data = res.data[0];
        setPriorFyDebt(getShortForm(data.tot_pub_debt_out_amt.toString(), false));
        basicFetch(priorPriorDebtRequest.getUrl()).then(priorRes => {
          if (priorRes.data) {
            const priorData = priorRes.data[0];

            const difference = Number(data.tot_pub_debt_out_amt) - Number(priorData.tot_pub_debt_out_amt);

            setDebtDirection(difference > 0 ? 'increased' : 'decreased');
            setDebtChange(getShortForm(Math.abs(difference).toString(), false));
          }
        });
      }
    });
  }, []);
  const anchorTextLatestFY = (FY, idx, anchorIdx) => {
    const anchor = getAFGFootnotes(FY + 1)[idx];
    return <AnchorText link={anchor.anchors[anchorIdx].link} text={anchor.anchors[anchorIdx].text} />;
  };

  const revenueHeading = (
    <>
      In fiscal year {fiscalYear}
      {anchorTextLatestFY(fiscalYear, 0, 0)}, the federal government {revenueHas} ${fytdRevenue} in{' '}
      <span style={{ fontStyle: 'italic' }}>revenue.</span>
    </>
  );

  const spendingHeading = (
    <>
      In fiscal year {fiscalYear}, the federal government {spendingHas} <span style={{ fontStyle: 'italic' }}>spent</span> ${fytdSpending}.
    </>
  );

  const deficitHeading = (
    <>
      The amount by which spending {deficitExceeds} revenue, ${fytdDeficit} in {fiscalYear}, is referred to as{' '}
      <span style={{ fontStyle: 'italic' }}>deficit</span> spending.
    </>
  );
  const debtHeading = (
    <>
      The deficit this year {debtContributed} to a national <span style={{ fontStyle: 'italic' }}>debt</span> of ${latestDebt} through {debtDate}.
    </>
  );

  const exciseTaxes = (
    <GlossaryPopoverDefinition
      term="Excise"
      page="Revenue Explainer & AFG Overview Page"
      glossary={glossary}
      glossaryClickHandler={setGlossaryClickEvent}
    >
      excise
    </GlossaryPopoverDefinition>
  );

  const revenueBody = (
    <>
      <p>
        The federal government collects revenue from a variety of sources, including individual income taxes, payroll taxes, corporate income taxes,
        and {exciseTaxes} taxes. It also collects revenue from services like admission to national parks and customs duties.
      </p>
      <p>
        In {priorFiscalYear}
        {anchorTextLatestFY(priorFiscalYear, 1, 0)}, the federal government collected ${priorFyRevenue}. The primary source of revenue for the U.S.
        government in {priorFiscalYear} was {revenueCategory}.
      </p>
    </>
  );
  const spendingBody = (
    <>
      <p>
        The federal government funds a variety of programs and services that support the American public. The government also spends money on interest
        it has incurred on outstanding federal debt, including Treasury notes and bonds.
      </p>
      <p>
        In {priorFiscalYear} the federal government spent ${priorFySpending}, with the majority spent on {spendingCategory}.
      </p>
    </>
  );
  const deficitBody = (
    <>
      <p>A budget deficit occurs when the money spent exceeds the money collected for a given period.</p>
      <p>
        In {priorFiscalYear}, the federal government spent ${priorFyDeficit} more than it collected, resulting in a deficit. Compared to{' '}
        {priorPriorYear}, the national deficit {deficitDirection} by ${deficitChange} in {priorFiscalYear}.
      </p>
    </>
  );
  const debtBody = (
    <>
      <p>
        The national debt is the money the federal government has borrowed to cover the outstanding balance of expenses incurred over time. To pay for
        a deficit, the federal government borrows additional funds, which increases the debt. Other activities contribute to the change in federal
        debt, such as changes in the Treasury’s operating cash account and federal student loans. The total debt for the US through {debtToPennyDate}{' '}
        is ${debt}.
      </p>
      <p>
        At the end of {priorFiscalYear} the government had ${priorFyDebt} in federal debt. In {priorFiscalYear}, the national debt {debtDirection} by
        ${debtChange} compared to {priorPriorYear}.
      </p>
    </>
  );
  const topicSectionMap = [
    {
      id: 'government-revenue',
      pageName: 'Government Revenue',
      header: revenueHeading,
      body: revenueBody,
      linkUrl: '/americas-finance-guide/government-revenue/',
      linkText: 'Learn more about government revenue',
      eventNumber: '5',
    },
    {
      id: 'federal-spending',
      pageName: 'Federal Spending',
      header: spendingHeading,
      body: spendingBody,

      linkUrl: '/americas-finance-guide/federal-spending/',
      linkText: 'Learn more about federal spending',
      eventNumber: '5',
    },
    {
      id: 'national-deficit',
      pageName: 'National Deficit',
      header: deficitHeading,
      body: deficitBody,
      linkUrl: '/americas-finance-guide/national-deficit/',
      linkText: 'Learn more about national deficit',
      eventNumber: '6',
    },
    {
      id: 'national-debt',
      pageName: 'National Debt',
      header: debtHeading,
      body: debtBody,
      linkUrl: '/americas-finance-guide/national-debt/',
      linkText: 'Learn more about national debt',
      eventNumber: '7',
      image: '/topics-section-images/homepage_debt_1200x630.png',
      imageAltText:
        'A variety of hands reach up with objects, including a magnifying glass, a gold coin, a calculator, a pencil, a dollar bill, a clock, and a megaphone.',
    },
  ];

  return (
    <>
      {topicSectionMap.map((section, index) => {
        return (
          <React.Fragment key={index}>
            <AfgTopicCard
              heading={section.header}
              body={section.body}
              eventNumber={section.eventNumber}
              id={section.id}
              linkText={section.linkText}
              linkUrl={section.linkUrl}
              pageName={section.pageName}
              image={section.image}
              imageAltText={section.imageAltText}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default TopicSection;
