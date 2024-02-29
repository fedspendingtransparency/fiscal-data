import React, { FunctionComponent, useEffect, useState } from 'react';
import SavingsBondsSoldByTypeChart, { ISavingBondsByTypeChartData } from './savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart';
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
  const savingsBondsEndpoint = 'v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond';
  const [chartData, setChartData] = useState<ISavingBondsByTypeChartData[]>();

  useEffect(() => {
    basicFetch(`${apiPrefix}${savingsBondsEndpoint}&page[size]=1`).then(metaRes => {
      const pageSize = metaRes.meta['total-pages'];
      basicFetch(`${apiPrefix}${savingsBondsEndpoint}&page[size]=${pageSize}`).then(res => {
        if (res.data) {
          const currentData = sortByType(res.data, 'record_fiscal_year', 'security_class_desc', 'net_sales_amt');
          const allData = [...historicalData, ...currentData].sort((a, b) => a.year - b.year);
          setChartData(allData);
        }
      });
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
