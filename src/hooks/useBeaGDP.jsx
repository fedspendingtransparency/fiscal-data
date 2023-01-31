import { useState, useEffect } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import simplifyNumber from '../helpers/simplify-number/simplifyNumber';
import { adjustDataForInflation }  from '../helpers/inflation-adjust/inflation-adjust';

const useBeaGDP = (cpiData, inflationAdjust) => {
  const [finalGDPData, setFinalGDPData] = useState(null);
  const [gdpMinYear, setGDPMinYear] = useState(0);
  const [gdpMaxYear, setGDPMaxYear] = useState(0);
  const [gdpMinAmount, setGDPMinAmount] = useState(0);
  const [gdpMaxAmount, setGDPMaxAmount] = useState(0);
  const [isGDPLoading, setIsGDPLoading] = useState(true);

  const queryData = useStaticQuery(
    graphql`
      query {
        allBeaGdp {
          nodes {
            dataValue
            lineDescription
            timePeriod
            id
          }
        }
      }
    `
  );

  useEffect(() => {
    let GDPYearlyData = [];
    let curYear = 1948;
    const beaData = queryData?.allBeaGdp?.nodes;
    beaData?.forEach(gpd => {
      const year = parseInt(gpd.timePeriod.slice(0, -2));
      let allQuartersForGivenYear;
      if (year === curYear ) {
        if (year <= 1976) {
          allQuartersForGivenYear = beaData.filter(
            entry =>
              entry.timePeriod.includes(year.toString() + "Q1") ||
              entry.timePeriod.includes(year.toString() + "Q2") ||
              entry.timePeriod.includes((year - 1).toString() + "Q3") ||
              entry.timePeriod.includes((year - 1).toString() + "Q4")
          );
        } else if (year >= 1977) {
          allQuartersForGivenYear = beaData.filter(
            entry =>
              entry.timePeriod.includes(year.toString() + "Q1") ||
              entry.timePeriod.includes(year.toString() + "Q2") ||
              entry.timePeriod.includes(year.toString() + "Q3") ||
              entry.timePeriod.includes((year - 1).toString() + "Q4")
          );
        }
        if (
          year >= 1977 &&
          allQuartersForGivenYear.find(entry =>
            entry.timePeriod.includes(year.toString() + "Q3")
          )
        ) {
          let totalGDP = 0;
          allQuartersForGivenYear.forEach(quarter => {
            totalGDP += parseFloat(quarter.dataValue.replace(/,/g, ""));
          });
          GDPYearlyData.push({
            x: year,
            // Correct BEA data to display in trillions
            actual: parseInt(String(totalGDP) + "000000") / 4,
            fiscalYear: String(year)
          });
        } else if (year <= 1976) {
          let totalGDP = 0;
          allQuartersForGivenYear.forEach(quarter => {
            totalGDP += parseFloat(quarter.dataValue.replace(/,/g, ""));
          });
          GDPYearlyData.push({
            x: year,
            // Correct BEA data to display in trillions
            actual: parseInt(String(totalGDP) + "000000") / 4,
            fiscalYear: String(year)
          });
        }
        curYear++;
      }
    });

    if(inflationAdjust) {
      GDPYearlyData = adjustDataForInflation(
        GDPYearlyData,
        'actual',
        'fiscalYear',
        cpiData
      );
    }

    GDPYearlyData.map(gdp =>
      gdp.y = parseFloat(
        simplifyNumber(gdp.actual, false).slice(0, -2)
      ));

    setFinalGDPData(GDPYearlyData);

    const gdpMaxAmount = GDPYearlyData.reduce((max, gdp) =>
      max.x > gdp.x ? max : gdp
    );

    const gdpMinAmount = GDPYearlyData.reduce((min, gdp) =>
      min.x < gdp.x ? min : gdp
    );
    setGDPMaxYear(GDPYearlyData[GDPYearlyData.length - 1].x);
    setGDPMinYear(GDPYearlyData[0].x);
    setGDPMaxAmount(gdpMaxAmount.y);
    setGDPMinAmount(gdpMinAmount.y);
    setIsGDPLoading(false);

  }, []);

  return {
    finalGDPData,
    gdpMinYear,
    gdpMaxYear,
    gdpMinAmount,
    gdpMaxAmount,
    isGDPLoading
  };
};

export default useBeaGDP;
