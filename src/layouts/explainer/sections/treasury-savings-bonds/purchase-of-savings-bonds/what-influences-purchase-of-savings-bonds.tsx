import React, { FunctionComponent, useEffect, useState } from 'react';
import SavingsBondsSoldByTypeChart from './savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart';
import VisualizationCallout from '../../../../../components/visualization-callout/visualization-callout';
import { visWithCallout } from '../../../explainer.module.scss';
import { treasurySavingsBondsExplainerSecondary } from '../treasury-savings-bonds.module.scss';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { graphql, useStaticQuery } from 'gatsby';
import { sortByType } from './savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart-helper';
const WhatInfluencesPurchaseOfSavingsBonds: FunctionComponent = () => {
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
  const savingsBondsEndpoint = 'v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond&page[size]=600';
  const [chartData, setChartData] = useState();

  useEffect(() => {
    basicFetch(`${apiPrefix}${savingsBondsEndpoint}`).then(res => {
      if (res.data) {
        const data = sortByType(res.data, 'record_fiscal_year', 'security_class_desc', 'net_sales_amt');
        console.log([...historicalData, ...data]);
        setChartData([...historicalData, ...data]);
        // const sumMap = {};
        // data.forEach(entry => {
        //   const year = entry?.record_fiscal_year;
        //   const prev = entry[year];
        //   const cur = entry.net_sales_amt;
        //   let newVal = cur;
        //   if (prev) {
        //     newVal = cur + prev;
        //   }
        //   sumMap[year] = newVal;
        // });
      }
    });
  }, []);

  return (
    <>
      <p>The chart below shows savings bond sales over time for all XX(number of bond types) savings bond types and their relative popularity.</p>
      <div className={visWithCallout}>
        <SavingsBondsSoldByTypeChart chartData={chartData} />
        <VisualizationCallout color={treasurySavingsBondsExplainerSecondary}>
          <p>
            Savings bonds were most popular in YYYY (year of most sales) and YYYY (year of second most sales) when ## and ## bonds were sold,
            respectively.
          </p>
        </VisualizationCallout>
      </div>
    </>
  );
};

export default WhatInfluencesPurchaseOfSavingsBonds;
