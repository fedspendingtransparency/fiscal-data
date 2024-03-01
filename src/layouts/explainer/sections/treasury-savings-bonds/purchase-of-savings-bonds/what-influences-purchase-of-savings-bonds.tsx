import React, { FunctionComponent, useEffect, useState } from 'react';
import SavingsBondsSoldByTypeChart from './savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart';
import VisualizationCallout from '../../../../../components/visualization-callout/visualization-callout';
import { visWithCallout } from '../../../explainer.module.scss';
import { treasurySavingsBondsExplainerSecondary } from '../treasury-savings-bonds.module.scss';
import { subsectionHeader } from './what-influences-purchase-of-savings-bonds.module.scss';
import ImageContainer from '../../../explainer-components/image-container/image-container';
import BondPoster from '../../../../../../static/images/savings-bonds/Bond-Poster.png';
import PresidentKennedy from '../../../../../../static/images/savings-bonds/President-Kennedy-Holding-Bond.png';
import { basicFetch, apiPrefix } from '../../../../../utils/api-utils';
import { getShortForm } from '../../../../../utils/rounding-utils';
import { graphql, useStaticQuery } from 'gatsby';
import { sortByType } from './savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart-helper';

interface BondSaleEntry {
  record_fiscal_year: string;
  net_sales_amt: string;
  security_class_desc: string;
}

type SalesData = Record<string, number>;

const WhatInfluencesPurchaseOfSavingsBonds: FunctionComponent = () => {
  const [chartData, setChartData] = useState<ISavingBondsByTypeChartData[]>();
  const [mostBondSalesYear, setMostBondSalesYear] = useState<string | null>(null);
  const [mostBondSales, setMostBondSales] = useState<number>(0);
  const [secondMostBondSalesYear, setSecondMostBondSalesYear] = useState<string | null>(null);
  const [secondMostBondSales, setSecondMostBondSales] = useState<number>(0);
  const [bondTypes, setBondTypes] = useState<number>(0);

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
  const historicalData = sortByType(savingsBondsByTypeHistorical, 'year', 'bond_type', 'sales');
  const savingsBondsEndpoint = 'v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond';


  useEffect(() => {
    basicFetch(`${apiPrefix}${savingsBondsEndpoint}&page[size]=1`).then(metaRes => {
      const pageSize = metaRes.meta['total-pages'];
      basicFetch(`${apiPrefix}${savingsBondsEndpoint}&page[size]=${pageSize}`).then(res => {
        if (res.data) {
          const currentData = sortByType(res.data, 'record_fiscal_year', 'security_class_desc', 'net_sales_amt');
          const allData = [...historicalData, ...currentData].sort((a, b) => a.year - b.year);
          setChartData(allData);
          const bondTypeset = new Set();
          allData.forEach(yearRecord => {
            Object.keys(yearRecord).forEach(bondName => {
              if(bondName !== 'year'){
                bondTypeset.add(bondName);
              }
            })
          })
          setBondTypes(bondTypeset.size)
        }
        const data: BondSaleEntry[] = res.data;
        const salesByYear: SalesData = {};
        data.forEach((entry: BondSaleEntry) => {
          const year = entry.record_fiscal_year
          const salesAmount = Number(entry.net_sales_amt); 
          salesByYear[year] = (salesByYear[year] || 0) + salesAmount;
        });
    
        const sortedYears = Object.entries(salesByYear)
          .sort((a, b) => b[1] - a[1])
          .map(([year, sales]) => ({ year, sales: Math.round(sales) }));
  
        if (sortedYears.length > 0) {
          setMostBondSalesYear(sortedYears[0].year);
          setMostBondSales(sortedYears[0].sales);
          if (sortedYears.length > 1) {
            setSecondMostBondSalesYear(sortedYears[1].year);
            setSecondMostBondSales(sortedYears[1].sales);
          }
        }
      });
    });
  }, []);

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
        bonds to finance the Revolutionary War. These early loans to the government were introduced to raise funds from the American public to support
        war efforts as well as other national projects like the construction of the Panama Canal.
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
        In 1963, President John F. Kennedy aimed to modernize savings bonds by signing legislation that allowed for the creation of Series EE and
        Series H savings bonds. These new savings bonds allowed workers to automatically invest a portion of their paycheck in what was known as the
        Payroll Savings Plan, which reduced paper certificates, and moved to an electronic record-keeping system. This new program was accompanied by
        nationwide marketing and helped increase the profile of the savings bond program in subsequent decades.
      </p>
      <ImageContainer color={treasurySavingsBondsExplainerSecondary} caption="President John F. Kennedy holds a U.S. savings bond.">
        <img src={PresidentKennedy} alt="President John F. Kennedy holds a U.S. savings bond." />
      </ImageContainer>
      <p>The chart below shows savings bond sales over time for all {bondTypes} savings bond types and their relative popularity.</p>
      <div className={visWithCallout}>
        <SavingsBondsSoldByTypeChart chartData={chartData} />
        <VisualizationCallout color={treasurySavingsBondsExplainerSecondary}>
          <p>
            Savings bonds were most popular in {mostBondSalesYear} and {secondMostBondSalesYear} when {getShortForm(mostBondSales)} and {getShortForm(secondMostBondSales)} bonds were sold,
            respectively.
          </p>
        </VisualizationCallout>
      </div>
      <h5 className={subsectionHeader}>Interest Rates and Inflation</h5>
      <p>
        The economy can also influence the popularity of investing in savings bonds. In times of heightened economic uncertainty, individual investors
        may favor savings bonds due to their low risk, even if they produce a more modest return. Conversely, economic growth may create attractive
        investment opportunities outside of savings bonds, where individual investors may be able to earn higher interest rates.
      </p>
      <p>
        In general, when interest rates are higher, demand for fixed-rate savings bonds like Series E tends to increase. However, when people expect
        inflation to increase, savings bonds like Series I become attractive because they provide protection against inflation, preserving the value
        of the money invested. In the spring of 2021, inflation in the United States began to rise over three percent and would grow to over six
        percent by September 2022. In response, the American public invested heavily in Series I bonds, purchasing nearly $153 billion of Series I
        bonds between April 2021 and February 2023. The chart below shows inflation data and I bond purchases from the last 20 years.
      </p>
    </>
  );
};

export default WhatInfluencesPurchaseOfSavingsBonds;
