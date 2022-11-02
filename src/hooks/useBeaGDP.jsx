import { useState, useEffect } from "react";
import { graphql, useStaticQuery } from "gatsby";

const setDynamicValue = (gaEvent, dynamicValue) => {
  if (!gaEvent) return null;
  gaEvent.Trigger = gaEvent.Trigger.replace("$XX", `$${dynamicValue}`);
  gaEvent.eventLabel = gaEvent.eventLabel.replace("$XX", `$${dynamicValue}`);
  return gaEvent;
};

// type: 'Debt', 'Deficit', etc. must be capitalized + match whats in the query name and node query
const useGAEventTracking = (evNumber, type, dynamicValue) => {
  const [gaEvent, setGaEvent] = useState(null);
  const allBeaGdp = useStaticQuery(
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

  let GDPYearlyData = [];
  allBeaGdp.data.allBeaGdp.nodes.forEach((gpd)=>{
    const quarter = gpd.timePeriod.slice(4);
    const year = parseInt(gpd.timePeriod.slice(0, -2));
    const fiscalYear = quarter === 'Q4' ? year + 1 : year;
    const amount = parseInt(
      String(entry.DataValue.replace(/,/g, '') + '000000')
    );
    if (fiscalYear === year) {
      total += amount;
    } else {
      total = amount;
    }

    if (quarter === 'Q3' && fiscalYear >= 2015) {
      GDPYearlyData.push({
        x: fiscalYear,
        y: total / 4,
        actual: total / 4,
        fiscalYear: String(fiscalYear),
      });
    }

  })

  useEffect(() => {
    
  }, [evNumber, type, eventTrackingCsvs, dynamicValue]);
  return gaEvent;
};

export default useGAEventTracking;
