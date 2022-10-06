import { useState, useEffect } from "react";
import { graphql, useStaticQuery } from "gatsby";

const useGAEventTracking = evNumber => {
  const [data, setData] = useState(null);
  const allDeficitExplainerEventTrackingCsv = useStaticQuery(
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
      }
    `
  );

  useEffect(() => {
    const gaEvent = allDeficitExplainerEventTrackingCsv?.allDeficitExplainerEventTrackingCsv?.deficitExplainerEventTrackingCsv?.filter(
      eventTrack => eventTrack.Number == evNumber
    );
    if (gaEvent) {
      setData(gaEvent[0] ? gaEvent[0] : null);
    }
  }, [evNumber]);

  return data;
};

export default useGAEventTracking;
