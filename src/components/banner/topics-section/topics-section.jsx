import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookOpen} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Grid } from "@material-ui/core"
import ExplainerTile from "./explainer-tile/explainer-tile";
import debtDesktopImage from '../../../images/homepage_debt_1200x630.png';
import debtMobileImage from '../../../images/homepage_debt_square.png';
import deficitDesktopImage from '../../../images/homepage_deficit_coming-soon_desktop.png';
import deficitMobileImage from '../../../images/homepage_deficit_coming-soon_mobile.png';
import {
  tileContainer,
  sectionHeader,
  siteBannerHeader,
  topicsSectionContainer,
  line
} from "./topics-section.module.scss";
import {withWindowSize} from "react-fns";
import {breakpointLg} from "../../../variables.module.scss";
import {pxToNumber} from "../../../helpers/styles-helper/styles-helper";


const TopicsSection = ({width}) => {
  const pageMap = {
    'debt': {
      title: 'What is the national debt?',
      body: 'The national debt enables the federal government to pay for important programs and ' +
        'services for the American public. Explore debt concepts, the latest values, and trends ' +
        'over time.',
      imageAltText: 'Hands raised in the air holding various objects, including a calculator, a pencil, ' +
        'money, and magnifying glass',
      desktopImagePath: debtDesktopImage,
      mobileImagePath: debtMobileImage,
      mainFeature: true,
      path: '/national-debt/'
    },
    'deficit': {
      title: 'What is the national deficit?',
      body: 'A national deficit occurs when the money going out exceeds the money coming in for a ' +
        'given period of time. Learn more about the U.S. deficit and how it has changed over time.',
      imageAltText: '',
      desktopImagePath: deficitDesktopImage,
      mobileImagePath: deficitMobileImage,
      mainFeature: false
    }
  }

  const mainWidth = 8;
  const secondaryWidth = 4;

  return (
    <div className={topicsSectionContainer}>
      <div className={sectionHeader}>
        TOPICS
      </div>
      <h5 className={siteBannerHeader}>
        <FontAwesomeIcon icon={faBookOpen}/>
        <div>
          Your Guide to America’s Finances
        </div>
      </h5>
      <i>
        Fiscal Data presents the first of four concepts from Your Guide to America's Finances,
        which will be added in the coming months.
      </i>
      <div className={tileContainer}>
        <Grid container spacing={4}>
          <Grid item md={mainWidth}>
            <ExplainerTile content={pageMap['debt']} width={width} />
          </Grid>
          {width < pxToNumber(breakpointLg) ? <div className={line}/> : undefined}
          <Grid item md={secondaryWidth}>
            <ExplainerTile content={pageMap['deficit']} width={width} />
          </Grid>
        </Grid>
      </div>
    </div>
  )
};

export default withWindowSize(TopicsSection);
