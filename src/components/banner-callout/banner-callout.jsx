import React from 'react';
import CustomLink  from '../links/custom-link/custom-link';
import { banner, sideTab, calloutText, icon, updateList } from './banner-callout.module.scss';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BannerCallout = ({bannerCallout}) => {
    const calloutCopy = {
        "XRCallout":
            <>
              To calculate foreign currency exchange rates for tax reporting, visit the{" "}
              <CustomLink url={"/currency-exchange-rates-converter/"}>Currency Exchange Rates Converter</CustomLink>
              {" "}page.
            </>,
        "DTSAPIUpdate":
            <>
              <b>Updates are coming soon!</b>
              <ul className={updateList}>
                <li>The Daily Treasury Statement (DTS) dataset will be updated to match the published DTS.</li>
                <li>All DTS API endpoints will be renamed to show DTS table names.</li>
                <li>The Federal Tax Deposits and Short-Term Cash Investments tables will contain historical data only (through Feb. 13, 2023).</li>
                <li>There will be a new API endpoint for the Inter-Agency Tax Transfers table, which started on Feb. 14, 2023.</li>
              </ul>
            </>
    }

    const currentCallout = calloutCopy[bannerCallout];

    if (currentCallout) {
        return (
            <div className={banner} data-testid="banner">
                <div className={sideTab} />
                <span className={calloutText}>
                    <FontAwesomeIcon className={icon} icon={faCircleInfo} />
                    <div>
                      {currentCallout}
                    </div>
                </span>
            </div>
        );
    } else {
        return null;
    }
}

export default BannerCallout;
