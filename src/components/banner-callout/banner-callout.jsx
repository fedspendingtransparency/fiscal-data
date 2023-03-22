import React from 'react';
import { Link } from "gatsby";

const BannerCallout = ({calloutText, calloutURL}) => {

    const callout = calloutText.split("**");

    return (
        <>
            <div>
                {callout[0]}
            </div>
            {callout.length > 1 && <>
            <Link to={calloutURL}
            data-testid='link'>{callout[1]}</Link>
            <div>
                {callout[2]}
            </div>
            </>
            }
            
        </>
    );
}

export default BannerCallout;