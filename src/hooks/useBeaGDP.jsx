import { useState, useEffect } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import simplifyNumber from '../helpers/simplify-number/simplifyNumber';
import { adjustDataForInflation }  from '../helpers/inflation-adjust/inflation-adjust';

const useBeaGDP = (cpiData) => {
  const [finalGDPData, setFinalGDPData] = useState(null);
  const [gdpMinYear, setGdpMinYear] = useState(0);
  const [gdpMaxYear, setGdpMaxYear] = useState(0);
  const [gdpMinAmount, setGdpMinAmount] = useState(0);
  const [gdpMaxAmount, setGdpMaxAmount] = useState(0);
  const [gdpLastAmountActual, setgdpLastAmountActual] = useState(0);
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
    let total = 0;
    const beaData = queryData?.allBeaGdp?.nodes;
    beaData?.forEach(gpd => {
      const quarter = gpd.timePeriod.slice(4);
      const year = parseInt(gpd.timePeriod.slice(0, -2));
      const fiscalYear = quarter === 'Q4' ? year + 1 : year;
      const amount = parseInt(
        String(gpd.dataValue.replace(/,/g, '') + '000000')
      );
      if (fiscalYear === year) {
        total += amount;
      } else {
        total = amount;
      }
      if (quarter === 'Q3' && fiscalYear >= 2015) {
        GDPYearlyData.push({
          x: fiscalYear,
          actual: total / 4,
          fiscalYear: String(fiscalYear),
        });
      }
      
    });

    GDPYearlyData = adjustDataForInflation(
      GDPYearlyData,
      'actual',
      'fiscalYear',
      cpiData 
    ); 

    GDPYearlyData.map(gdp => {
      gdp.y = parseFloat(
        simplifyNumber(gdp.actual, false).slice(0, -2)
      );
    });

    setFinalGDPData(GDPYearlyData);

    const gdpMaxAmount = GDPYearlyData.reduce((max, gdp) =>
      max.x > gdp.x ? max : gdp
    );

    const gdpMinAmount = GDPYearlyData.reduce((min, gdp) =>
      min.x < gdp.x ? min : gdp
    );
    
    setGdpMaxYear(GDPYearlyData[GDPYearlyData.length - 1].x);
    setGdpMinYear(GDPYearlyData[0].x);
    setGdpMaxAmount(gdpMaxAmount.y);
    setGdpMinAmount(gdpMinAmount.y);
    setgdpLastAmountActual(GDPYearlyData[GDPYearlyData.length - 1].actual);
    setIsGDPLoading(false);

  }, []);

  return {finalGDPData, gdpMinYear, gdpMaxYear, gdpMinAmount, gdpMaxAmount, gdpLastAmountActual, isGDPLoading};
};

export default useBeaGDP;
