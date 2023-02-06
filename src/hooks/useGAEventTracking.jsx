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
        allSpendingExplainerEventTrackingCsv {
          spendingExplainerEventTrackingCsv: nodes {
            Number
            Trigger
            eventAction
            eventCategory
            eventLabel
          }
        }
        allRevenueExplainerEventTrackingCsv {
          revenueExplainerEventTrackingCsv: nodes {
            Number
            Trigger
            eventAction
            eventCategory
            eventLabel
          }
        }
        allAfgOverviewEventTrackingCsv {
          afgOverviewEventTrackingCsv: nodes {
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

  const getGAEvent = (eventNumber) => {
    if(eventNumber && eventTrackingCsvs){
      const lookupTypeQuery = `all${type}EventTrackingCsv`;
      const typeToLower = type[0].toLowerCase() + type.slice(1);
      const lookupTypeNode = `${typeToLower}EventTrackingCsv`;
      const lookup =
        eventTrackingCsvs[lookupTypeQuery] &&
        eventTrackingCsvs[lookupTypeQuery][lookupTypeNode];
      const gaEvent = lookup
        ?.filter(eventTrack => eventTrack.Number === eventNumber)
        ?.map(eventInfo => {
          if (dynamicValue) {
            eventInfo = setDynamicValue(eventInfo, dynamicValue);
          }
          return eventInfo;
        });

        if (gaEvent) {
          return (gaEvent[0] ? gaEvent[0] : null);
        }
    }
    return null;

  }

  useEffect(() => {
    if (type && eventTrackingCsvs) {
      const lookupTypeQuery = `all${type}EventTrackingCsv`;
      const typeToLower = type[0].toLowerCase() + type.slice(1);
      const lookupTypeNode = `${typeToLower}EventTrackingCsv`;
      const lookup =
        eventTrackingCsvs[lookupTypeQuery] &&
        eventTrackingCsvs[lookupTypeQuery][lookupTypeNode];
      const gaEvent = lookup
        ?.filter(eventTrack => eventTrack.Number === evNumber)
        ?.map(eventInfo => {
          if (dynamicValue) {
            eventInfo = setDynamicValue(eventInfo, dynamicValue);
          }
          return eventInfo;
        });


      if (gaEvent) {
        setGaEvent(gaEvent[0] ? gaEvent[0] : null);
      }
    }
  }, [evNumber, type, eventTrackingCsvs, dynamicValue]);
  return {gaEvent, getGAEvent};
};

export default useGAEventTracking;
