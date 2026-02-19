import React, { FunctionComponent, useEffect, useState } from 'react';
import SavingsBondsSoldByTypeChart, { ISavingBondsByTypeChartData } from './savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart';
import VisualizationCallout from '../../../../../components/visualization-callout/visualization-callout';
import { visWithCallout } from '../../../explainer.module.scss';
import { treasurySavingsBondsExplainerSecondary } from '../treasury-savings-bonds.module.scss';
import { subsectionHeader } from './what-influences-purchase-of-savings-bonds.module.scss';
import ImageContainer from '../../../explainer-components/image-container/image-container';
import BondPoster from '../../../../../../static/images/savings-bonds/Bond-Poster.png';
import PresidentKennedy from '../../../../../../static/images/savings-bonds/President-Kennedy-Holding-Bond.png';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { getShortForm } from '../../../../../utils/rounding-utils';
import IBondSalesChart from './i-bond-sales-chart/i-bond-sales-chart';
import { graphql, useStaticQuery } from 'gatsby';
import { fyEndpoint, sortByType } from './savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart-helper';
import { getDateWithoutTimeZoneAdjust } from '../../../../../utils/date-utils';
import AnchorText from '../../../../../components/anchor-text/anchor-text';
import { getSaleBondsFootNotes } from '../learn-more/learn-more-helper';
import { adjustDataForInflation } from '../../../../../helpers/inflation-adjust/inflation-adjust';
import { ICpiDataMap } from '../../../../../models/ICpiDataMap';
import { analyticsEventHandler } from '../../../explainer-helpers/explainer-helpers';

interface BondSaleEntry {
  year: string;
  [key: string]: string;
}

type SalesData = Record<string, number>;
type CalloutProps = {
  cpiDataByYear: ICpiDataMap[];
  cpi12MonthPercentChange: ICpiDataMap[];
};

const WhatInfluencesPurchaseOfSavingsBonds: FunctionComponent = ({ cpi12MonthPercentChange, cpiDataByYear }: CalloutProps) => {
  const [chartData, setChartData] = useState<ISavingBondsByTypeChartData[]>();
  const [curFy, setCurFy] = useState<string>();
  const [historyChartDate, setHistoryChartDate] = useState<Date>(new Date());
  const [inflationChartData, setInflationChartData] = useState<ISavingBondsByTypeChartData[]>();
  const [mostBondSalesYear, setMostBondSalesYear] = useState<string | null>(null);
  const [mostBondSales, setMostBondSales] = useState<number>(0);
  const [secondMostBondSalesYear, setSecondMostBondSalesYear] = useState<string | null>(null);
  const [secondMostBondSales, setSecondMostBondSales] = useState<number>(0);
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
  let savingsBondsByTypeHistorical = allSavingsBondsByTypeHistorical.allSavingsBondsByTypeHistoricalCsv.savingsBondsByTypeHistoricalCsv;

  const savingsBondsEndpoint = 'v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond';
  const anchor = getSaleBondsFootNotes()[1];
  useEffect(() => {
    basicFetch(`${apiPrefix}${savingsBondsEndpoint}&page[size]=1`).then(metaRes => {
      if (metaRes.meta && typeof metaRes.meta['total-pages'] !== 'undefined') {
        const pageSize = metaRes.meta['total-pages'];
        basicFetch(`${apiPrefix}${savingsBondsEndpoint}&page[size]=${pageSize}`).then(res => {
          if (res.data) {
            const currentData = sortByType(res.data, 'record_fiscal_year', 'security_class_desc', 'net_sales_amt');
            const historicalData = sortByType(savingsBondsByTypeHistorical, 'year', 'bond_type', 'sales');
            const allData = [...historicalData, ...currentData].sort((a, b) => a.year - b.year);

            res.data = adjustDataForInflation(res.data, 'net_sales_amt', 'record_fiscal_year', cpiDataByYear);
            const inflationCurrentData = sortByType(res.data, 'record_fiscal_year', 'security_class_desc', 'net_sales_amt');

            savingsBondsByTypeHistorical = adjustDataForInflation(savingsBondsByTypeHistorical, 'sales', 'year', cpiDataByYear);
            const inflationHistoricalData = sortByType(savingsBondsByTypeHistorical, 'year', 'bond_type', 'sales');
            const inflationAllData = [...inflationHistoricalData, ...inflationCurrentData].sort((a, b) => a.year - b.year);

            const salesByYear: SalesData = allData.reduce((acc, entry: BondSaleEntry) => {
              const totalSalesForYear = acc[entry.year] || 0;
              const yearlySales = Object.keys(entry)
                .filter(key => key !== 'year')
                .reduce((sum, key) => sum + Number(entry[key]), 0);

              acc[entry.year] = totalSalesForYear + yearlySales;
              return acc;
            }, {});

            const sortedYears = Object.entries(salesByYear)
              .map(([year, totalSales]) => ({ year, totalSales }))
              .sort((a, b) => b.totalSales - a.totalSales);

            if (sortedYears.length > 0) {
              setMostBondSalesYear(sortedYears[0].year);
              setMostBondSales(sortedYears[0].totalSales);
              if (sortedYears.length > 1) {
                setSecondMostBondSalesYear(sortedYears[1].year);
                setSecondMostBondSales(sortedYears[1].totalSales);
              }
            }
            setChartData(allData);
            setInflationChartData(inflationAllData);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${fyEndpoint}`).then(res => {
      if (res.data) {
        const data = res.data[0];
        setCurFy(data.record_fiscal_year);
        setHistoryChartDate(getDateWithoutTimeZoneAdjust(data.record_date));
      }
    });
  }, []);

  const footnoteClick = () => {
    analyticsEventHandler('Savings Bonds - Footnote Click', 'Footnote Click');
  };

  return (
    <>
      <p>
        Public demand for savings bonds has varied over time. Changes in interest rates or inflation can make bonds an attractive investment relative
        to other alternatives. In addition, investors may be motivated by the idea of supporting a national cause like a war effort or government
        project.
      </p>
      <h5 className={subsectionHeader}>Savings Bonds History</h5>
      <p>
        The sale of U.S. Treasury marketable securities began with the nation’s founding, where private citizens purchased $27 million in government
        bonds to finance the Revolutionary War.
        <AnchorText link={anchor.anchors[0].link} text={anchor.anchors[0].text} onAnchorClick={footnoteClick} /> These early loans to the government
        were introduced to raise funds from the American public to support war efforts as well as other national projects like the construction of the
        Panama Canal.
      </p>
      <p>
        During the Great Depression, the U.S. government sought to stabilize the economy by issuing a new type of Treasury security: savings bonds. In
        1935, savings bonds were first introduced to promote thriftiness and allow individuals to purchase government-backed bonds at an affordable
        price. For many decades, the minimum purchase price for marketable securities was several thousand dollars, which meant that only very wealthy
        individuals and institutions could afford to invest in them. With the introduction of the first savings bonds, regular citizens were able to
        invest in Treasury securities, and they gained popularity as a “safe haven” during times of economic uncertainty.
      </p>
      <ImageContainer color={treasurySavingsBondsExplainerSecondary} caption="Poster advertising savings bonds as “savings plans for all Americans.”">
        <img src={BondPoster} alt="Poster advertising savings bonds as “savings plans for all Americans.”" />
      </ImageContainer>
      <p>
        In 1963, President John F. Kennedy aimed to encourage the purchase of savings bonds by establishing the U.S. Industrial Payroll Savings
        Committee. This committee encouraged workers to automatically invest a portion of their paycheck in what was known as the Payroll Savings
        Plan, which reduced paper certificates, and moved to an electronic record-keeping system. This new program was accompanied by nationwide
        marketing and helped increase the profile of the savings bond program in subsequent decades.
      </p>
      <ImageContainer color={treasurySavingsBondsExplainerSecondary} caption="President John F. Kennedy holds a U.S. savings bond.">
        <img src={PresidentKennedy} alt="President John F. Kennedy holds a U.S. savings bond." />
      </ImageContainer>
      <p>The chart below shows savings bond sales over time for all savings bond types.</p>
      <figure className={visWithCallout}>
        <SavingsBondsSoldByTypeChart chartData={chartData} curFy={curFy} chartDate={historyChartDate} inflationChartData={inflationChartData} />
        <VisualizationCallout color={treasurySavingsBondsExplainerSecondary}>
          <p>
            Savings bonds were most popular in {mostBondSalesYear} and {secondMostBondSalesYear} when ${getShortForm(mostBondSales)} and $
            {getShortForm(secondMostBondSales)} bonds were sold, respectively.
          </p>
        </VisualizationCallout>
      </figure>
      <h5 className={subsectionHeader}>Interest Rates and Inflation</h5>
      <p>
        The economy can also influence the popularity of investing in savings bonds. In times of heightened economic uncertainty, individual investors
        may favor savings bonds due to their low risk, even if they produce a more modest return. Conversely, economic growth may create attractive
        investment opportunities outside of savings bonds, where individual investors may be able to earn higher interest rates.
      </p>
      <p>
        In general, when interest rates are higher, demand for fixed-rate savings bonds like Series EE tends to increase. However, when people expect
        inflation to increase, savings bonds like Series I become attractive because they provide protection against inflation, preserving the value
        of the money invested. In the spring of 2021, inflation in the United States began to rise over three percent and would grow to over six
        percent by September 2022. In response, the American public invested heavily in Series I bonds, purchasing nearly $153 billion of Series I
        bonds between April 2021 and February 2023. The chart below shows inflation data and I bond purchases from the last 15 years.
      </p>
      <figure className={visWithCallout}>
        <IBondSalesChart cpi12MonthPercentChange={cpi12MonthPercentChange} curFy={curFy} />
        <VisualizationCallout color={treasurySavingsBondsExplainerSecondary}>
          <p>Generally, higher inflation rates are correlated with an increase in demand for inflation-protected securities like I bonds.</p>
        </VisualizationCallout>
      </figure>
    </>
  );
};

export default WhatInfluencesPurchaseOfSavingsBonds;
