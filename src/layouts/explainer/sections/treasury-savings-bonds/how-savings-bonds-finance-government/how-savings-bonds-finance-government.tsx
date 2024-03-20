import React, { useEffect, useState } from 'react';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import { subSectionTitle } from './how-savings-bonds-finance-government.module.scss';
import { breakpointLg, visWithCallout } from '../../../explainer.module.scss';
import GlossaryPopoverDefinition from '../../../../../components/glossary/glossary-term/glossary-popover-definition';
import BondImage from '../../../../../../static/images/savings-bonds/Series-E-Bond-Cropped.png';
import ImageContainer from '../../../explainer-components/image-container/image-container';
import { treasurySavingsBondsExplainerSecondary } from '../treasury-savings-bonds.module.scss';
import TypesOfSavingsBonds from './types-of-savings-bonds-table/types-of-savings-bonds';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import TypesOfSavingsBondsResponsive from './types-of-savings-bonds-table/types-of-savings-bonds-responsive';
import HowSavingsBondsSoldChart from './how-savings-bonds-finance-chart/how-savings-bonds-sold-chart';
import VisualizationCallout from '../../../../../components/visualization-callout/visualization-callout';
import { apiPrefix, basicFetch, monthFullNames } from '../../../../../utils/api-utils';
import { graphql, useStaticQuery } from 'gatsby';
import { useRecoilValueLoadable } from 'recoil';
import { savingsBondTypesData, savingsBondTypesLastCachedState } from '../../../../../recoil/savingsBondTypesDataState';
import useShouldRefreshCachedData from '../../../../../recoil/hooks/useShouldRefreshCachedData';

interface ChartDataItem {
  name: string;
  value: number;
  percent: number;
  securityType: string;
}

interface ApiResponse {
  data: {
    debt_held_public_mil_amt: number;
    security_class_desc: string;
    security_type_desc: string;
    record_date: string;
  }[];
  meta: { 'total-pages': number };
}

const HowSavingsBondsFinanceGovernment = ({ width }) => {
  const [numberOfBondTypes, setNumberOfBondTypes] = useState('12');
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [savingBondsPercentage, setSavingBondsPercentage] = useState<number | null>(null);
  const [historicalSavingBondsPercentage, setHistoricalSavingBondsPercentage] = useState<number | null>(null);
  const [percentageDifference, setPercentageDifference] = useState<number | null>(null);
  const [monthYear, setMonthYear] = useState<string | null>(null);
  const isDesktop = width >= pxToNumber(breakpointLg);
  const typesData = useRecoilValueLoadable(savingsBondTypesData);
  useShouldRefreshCachedData(Date.now(), savingsBondTypesData, savingsBondTypesLastCachedState);

  const allSavingsBondsByTypeHistorical = useStaticQuery(
    graphql`
      query {
        allSavingsBondsByTypeHistoricalCsv {
          savingsBondsByTypeHistoricalCsv: nodes {
            year
            bond_type
            sales
          }
        }
      }
    `
  );

  const savingsBondsByTypeHistorical = allSavingsBondsByTypeHistorical.allSavingsBondsByTypeHistoricalCsv.savingsBondsByTypeHistoricalCsv;
  const howSavingBondsSold = 'v1/debt/mspd/mspd_table_1?filter=record_date:eq';

  useEffect(() => {
    basicFetch(`${apiPrefix}${howSavingBondsSold}&page[size]=1`)
      .then((metaRes: ApiResponse) => {
        if (metaRes.meta && typeof metaRes.meta['total-pages'] !== 'undefined') {
          const pageSize = metaRes.meta['total-pages'];
          basicFetch(`${apiPrefix}${howSavingBondsSold}&page[size]=${pageSize}`)
            .then((res: ApiResponse) => {
              const relevantData = res.data
              .filter(item =>
                item.security_type_desc === 'Marketable' || item.security_type_desc === 'Nonmarketable'
              )
              .map(item => ({
                ...item,
                debt_held_public_mil_amt: Number(item.debt_held_public_mil_amt)
              }));
              const summedData = relevantData.reduce((acc: Record<string, ChartDataItem>, cur) => {
                const key = cur.security_class_desc;
                if (!acc[key]) {
                  acc[key] = { name: key, value: 0, percent: 0, securityType: cur.security_type_desc };
                }
                acc[key].value += cur.debt_held_public_mil_amt;
                return acc;
              }, {});

          const processedData = Object.values(summedData);
          const totalValue = Number(processedData.reduce((sum, item) => sum + item.value, 0));

              const dataWithPercentages = processedData.map(item => ({
                ...item,
                percent: (item.value/totalValue) * 100

              }));
              dataWithPercentages.sort((a,b) =>
              a.securityType === 'Nonmarketable' ? 1 : b.securityType !== 'Nonmarketanble' ? -1 : 0
              );
              setChartData(dataWithPercentages)

          const mostRecentItem = res.data.reduce((mostRecent, currentItem) => {
            const currentDate = new Date(currentItem.record_date);
            return currentDate > new Date(mostRecent.record_date) ? currentItem : mostRecent;
          }, res.data[0]);

          const mostRecentDate = new Date(mostRecentItem.record_date);
          const montRecentMonthYear = `${monthFullNames[mostRecentDate.getMonth()]} ${mostRecentDate.getFullYear()}`;
          setMonthYear(montRecentMonthYear);

          const tenYearsAgo = new Date(mostRecentDate);
          tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

          const historicalData = relevantData.filter(item => {
            const itemDate = new Date(item.record_date);
            return itemDate.getFullYear() === tenYearsAgo.getFullYear() && itemDate.getMonth() === tenYearsAgo.getMonth();
          });

          const processChartData = (dataSet, setIsHistorical = false) => {
            const totalValue = dataSet.reduce((sum, item) => sum + item.debt_held_public_mil_amt, 0);
            const savingsBondValue = dataSet
              .filter(item => item.security_class_desc === 'United States Savings Securities')
              .reduce((sum, item) => sum + item.debt_held_public_mil_amt, 0);
            const percentage = (savingsBondValue / totalValue) * 100;

            if (setIsHistorical) {
              setHistoricalSavingBondsPercentage(parseFloat(percentage.toFixed(1)));
            } else {
              setSavingBondsPercentage(parseFloat(percentage.toFixed(1)));
            }
          };
          processChartData(relevantData);
          if (historicalData.length) {
            processChartData(historicalData, true);
          }
        });
      }
    });
  }, []);

  const processTypesSavingsBondsData = res => {
    const totalData = [...savingsBondsByTypeHistorical, ...res];
    const types = totalData.map(element => {
      if (element.security_class_desc) {
        return element.security_class_desc;
      } else if (element.bond_type) {
        return element.bond_type;
      }
    });
    return Array.from(new Set(types));
  };

  useEffect(() => {
    if (typesData.state === 'hasValue') {
      const processedTypes = processTypesSavingsBondsData(typesData.contents.payload);
      setNumberOfBondTypes(processedTypes.length.toString());
    }
  }, [typesData.state]);

  useEffect(() => {
    if (savingBondsPercentage !== null && historicalSavingBondsPercentage !== null) {
      const difference = savingBondsPercentage - historicalSavingBondsPercentage;
      setPercentageDifference(parseFloat(difference.toFixed(1)));
    }
  }, [savingBondsPercentage, historicalSavingBondsPercentage]);

  const higherOrLower = percentageDifference > 0 ? 'higher than' : 'lower than';

  const tableContent = [
    {
      name: 'Type',
      content: ['I Bonds', 'EE Bonds'],
    },
    {
      name: 'Primary Advantage',
      content: ["Protect buyer's money from inflation", 'Guaranteed to double in value in 20 years'],
    },
    {
      name: 'Issuing Method',
      content: ['Primarily Electronic', 'Electronic Only'],
    },
    {
      name: 'Interest Earnings',
      content: ['A fixed interest rate and a variable rate based on inflation', 'A steady interest rate that does not change'],
    },
    {
      name: 'Redemption',
      content: [
        'Redeemable after 1 year; if redeemed in the first five years, the interest accumulated from the last three months will be deducted from the final payout',
      ],
    },
  ];

  const marketable = (
    <GlossaryPopoverDefinition term="Marketable Securities" page="Savings Bond Explainer">
      marketable
    </GlossaryPopoverDefinition>
  );

  const nonMarketable = (
    <GlossaryPopoverDefinition term="Non-Marketable Securities" page="Savings Bond Explainer">
      non-marketable
    </GlossaryPopoverDefinition>
  );

  const govAccountSeries = (
    <GlossaryPopoverDefinition term="Government Account Series" page="Savings Bond Explainer">
      Government Account Series
    </GlossaryPopoverDefinition>
  );

  const stateLocalGovSeries = (
    <GlossaryPopoverDefinition term="State and Local Government Series" page="Savings Bond Explainer">
      State and Local Government Series
    </GlossaryPopoverDefinition>
  );

  const debtHeldByPublic = (
    <GlossaryPopoverDefinition term="Debt Held by the Public" page="Savings Bond Explainer">
      debt held by the public
    </GlossaryPopoverDefinition>
  );

  const seriesIBonds = (
    <GlossaryPopoverDefinition term="Series I Bonds" page="Savings Bond Explainer">
      Series I bonds
    </GlossaryPopoverDefinition>
  );

  const seriesEEBonds = (
    <GlossaryPopoverDefinition term="Series EE Bonds" page="Savings Bond Explainer">
      Series EE bonds
    </GlossaryPopoverDefinition>
  );

  return (
    <>
      <span>
        The government finances programs like building and maintaining roads, school funding, or support for veterans through{' '}
        <CustomLink url={'/americas-finance-guide/government-revenue/'}>revenue</CustomLink> sources like taxes. When the government{' '}
        <CustomLink url={'/americas-finance-guide/federal-spending/'}>spends</CustomLink> more than it collects from revenue, this results in a{' '}
        <CustomLink url={'/americas-finance-guide/national-deficit/'}>deficit</CustomLink>, which requires the government to borrow money (
        <CustomLink url={'/americas-finance-guide/national-debt/'}>debt</CustomLink>) by issuing loans (securities) that it promises to pay back with
        interest. Different types of securities earn interest in different ways. Treasury groups savings bonds into two categories called {marketable}{' '}
        and {nonMarketable} securities, which reflects whether they can be resold to another individual or entity after they are purchased.
      </span>
      <ImageContainer color={treasurySavingsBondsExplainerSecondary} caption="A paper Series E Savings Bond">
        <img src={BondImage} alt="A paper Series E Savings Bond" />
      </ImageContainer>
      <span>
        Savings bonds are the most well-known type of non-marketable security and the only type available for purchase by individuals. Other types of
        non-marketable securities include {govAccountSeries}, which can be purchased from Treasury by other federal agencies, and{' '}
        {stateLocalGovSeries}, which can be purchased by state and local governments. Use the chart below to explore how different types of loans make
        up the total {debtHeldByPublic}.
      </span>
      <div className={visWithCallout}>
        <HowSavingsBondsSoldChart chartData={chartData} />
        <VisualizationCallout color={treasurySavingsBondsExplainerSecondary}>
          <p>
            Savings bonds make up {savingBondsPercentage}% of total debt held by the public through {monthYear}. This is {percentageDifference}{' '}
            percentage points {higherOrLower} the same as the percent of debt held by the public ten years ago ({historicalSavingBondsPercentage}%).
          </p>
        </VisualizationCallout>
      </div>
      <h5 className={subSectionTitle}>Types of Savings Bonds</h5>
      <span>
        Over the course of American history, the U.S. government has issued {numberOfBondTypes} types of savings bonds to help fund certain programs
        and special projects ranging from the Postal Service to the Armed Forces. Each bond type has different terms and ways that it earns interest.
        Today, there are two types of savings bonds available for purchase: {seriesIBonds} and {seriesEEBonds}.
      </span>
      {isDesktop ? <TypesOfSavingsBonds tableContent={tableContent} /> : <TypesOfSavingsBondsResponsive tableContent={tableContent} />}
    </>
  );
};

export default withWindowSize(HowSavingsBondsFinanceGovernment);
