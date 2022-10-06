import { useState, useEffect } from "react";
import { graphql, useStaticQuery } from "gatsby";

const useGAEventTracking = (evNumber, type) => {
  const [gaEvent, setGaEvent] = useState(null);
  const eventTrackingCsvs = useStaticQuery(
    graphql`
      query {
        allDeficitExplainerEventTrackingCsv {
          deficitExplainerEventTrackingCsv: nodes {
            Number
            Trigger
            eventAction
            eventCategory
            eventLabel
          }
        }
        allDebtExplainerEventTrackingCsv {
          debtExplainerEventTrackingCsv: nodes {
            Number
            Trigger
            eventAction
            eventCategory
            eventLabel
          }
        }
      }
    `
  );

  useEffect(() => {
    if (type) {
      const lookupTypeQuery = `all${type}ExplainerEventTrackingCsv`;
      const typeToLower = type[0].toLowerCase() + type.slice(1);
      const lookupTypeNode = `${typeToLower}ExplainerEventTrackingCsv`;
      const lookup = eventTrackingCsvs[lookupTypeQuery][lookupTypeNode];
      const gaEvent = lookup.filter(
        eventTrack => eventTrack.Number == evNumber
      );

      if (gaEvent) {
        console.log(gaEvent, "gaEvent");
        setGaEvent(gaEvent[0] ? gaEvent[0] : null);
      }
    }
  }, [evNumber, type]);

  return gaEvent;
};

export default useGAEventTracking;
