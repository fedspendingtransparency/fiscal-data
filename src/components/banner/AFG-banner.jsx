import {leadText, sectionHeader, siteBannerHeader, bannerContainer} from "./banner.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookOpen} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Grid } from "@material-ui/core"
import ExplainerCard from "./explainer-card";
import debtDesktopImage from '../../images/homepage_debt_1200x630.png';
import debtMobileImage from '../../images/homepage_debt_square.png';
import deficitDesktopImage from '../../images/homepage_deficit_coming-soon_desktop.png';
import deficitMobileImage from '../../images/homepage_deficit_coming-soon_mobile.png';


const AFGBanner = () => {
  const pageMap = {
    'debt': {
      title: 'What is the national debt?',
      body: 'The national debt enables the federal government to pay for important programs and ' +
        'services for the American public. Explore debt concepts, the latest values, and trends ' +
        'over time.',
      desktopImagePath: debtDesktopImage,
      mobileImagePath: debtMobileImage,
      main: true
    },
    'deficit': {
      title: 'What is the national deficit?',
      body: 'A national deficit occurs when the money going out exceeds the money coming in for a ' +
        'given period of time. Learn more about the U.S. deficit and how it has changed over time.',
      desktopImagePath: deficitDesktopImage,
      mobileImagePath: deficitMobileImage,
      main: false
    }
  }

  return (
    <div className={bannerContainer}>
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
      </div>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={6} md={8}>
            <ExplainerCard
              title={pageMap['debt'].title}
              body={pageMap['debt'].body}
              imagePath={pageMap['debt'].desktopImagePath}
              main={pageMap['debt'].main}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <ExplainerCard
              title={pageMap['deficit'].title}
              body={pageMap['deficit'].body}
              imagePath={pageMap['deficit'].desktopImagePath}
              main={pageMap['debt'].main}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  )
};

export default AFGBanner;
