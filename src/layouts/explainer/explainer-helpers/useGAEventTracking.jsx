import React, { useState, useEffect } from 'react'
import { graphql, useStaticQuery } from "gatsby";

const useGAEventTracking = () => {
    const [data, setData] = useState(null);
  
    useEffect(() => {
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
              `,
        );
        setData(allDeficitExplainerEventTrackingCsv.allDeficitExplainerEventTrackingCsv.deficitExplainerEventTrackingCsv)
    }, []);
  
    return [data];
  };
  
  export default useGAEventTracking;
