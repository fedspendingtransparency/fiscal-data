import React from 'react';
import {
  headerSubText,
  leadText,
  siteBannerHeader,
  sectionHeader
} from './banner.module.scss';
import Analytics from "../../utils/analytics/analytics";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookOpen} from "@fortawesome/free-solid-svg-icons";

export const analyticsObject = {
  category: 'Homepage Navigation',
  action: 'Button Click',
  label: 'Search Datasets Top'
}

const BannerLeadText = () => {
  const clickHandler = () => {
    Analytics.event(analyticsObject);
  }

  const headerText =
    <>
      <span>Explore and analyze <br /></span>
      <span className={headerSubText}>the fiscal operations of the U.S. government</span>
    </>;

  return (
    <div data-test-id="banner-lead-text" className={leadText}>
      <div className={sectionHeader}>
        TOPICS
      </div>
      <h5 className={siteBannerHeader}>
        <FontAwesomeIcon icon={faBookOpen}/>
        Your Guide to America’s Finances
      </h5>
      <i>
        Fiscal Data presents the first of four concepts from Your Guide to America's Finances,
        which will be added in the coming months.
      </i>
      {/*<h1 data-test-id="site-banner-header" className={siteBannerHeader}>*/}
      {/*  {headerText}*/}
      {/*</h1>*/}
      {/*<p className={tagLine}>*/}
      {/*  At Fiscal Data, you’ll find both historical and current data you can trust on topics such*/}
      {/*  as debt, spending, and savings bonds.*/}
      {/*</p>*/}
      {/*<Link className={siteHeaderButton}*/}
      {/*      to="/datasets/"*/}
      {/*      data-test-id="search"*/}
      {/*      onClick={clickHandler}*/}
      {/*>*/}
      {/*  Search Datasets*/}
      {/*</Link>*/}
    </div>
  );
};

export default BannerLeadText;
