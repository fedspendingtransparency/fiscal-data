import React from 'react'
import PageHelmet from "../../components/page-helmet/page-helmet";
import SiteLayout from '../../components/siteLayout/siteLayout';
import { Container, Grid, Box } from '@material-ui/core';
import DataSourcesMethodologies from '../../layouts/explainer/data-sources-methodologies/data-sources-methodologies';
import CustomLink from '../../components/links/custom-link/custom-link';
import { ChartPlaceholder } from '../../layouts/explainer/explainer-helpers/national-deficit/national-deficit-helper';
import * as styles from "./afg-overview.module.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandHoldingDollar, faMoneyBill1Wave} from "@fortawesome/free-solid-svg-icons";
import TopicSection from './afg-components/topic-section/topic-section';
import AfgIcon from './afg-components/afg-icon/afg-icon';

export default function index() {



  return (
    <SiteLayout isPreProd={false}>
      <Container className='mainContainer' maxWidth="md" >
        <div className="heroSection" mb={5}>
          <h1>A regular Statement and Account of the Receipts and Expenditures of all public Money shall be published from time to time.</h1>
          <p>U.S. Constitution, Article 1, Section 9</p>
        </div>
        <Box my={5}>Pointing Nav goes here</Box>
      
        <TopicSection
          heading='In fiscal year YYYY, the federal government has collected $X.X in revenue.'
          body='The federal government collects revenue from a variety of sources, including individual income taxes, payroll taxes, corporate income taxes, and excise taxes. It also collects revenue from services like admission to national parks and customs duties.'
          linkUrl='/government-revenue'
          linkText='Learn more about government revenue'
          linkColor='#0A2F5A'
          image='/topics-section-images/homepage_deficit_1200x630.png'
          
        />
        <TopicSection
          heading='In fiscal year YYYYY the federal government has spent $X.X.'
          body='The federal government funds a variety of programs and services that support the American public. The federal government also spends money on interest it has incurred on outstanding federal debt, including Treasury notes and bonds.'
          linkUrl='/federal-spending'
          linkText='Learn more about federal spending'
          linkColor='#005E56'
          image='/topics-section-images/homepage_deficit_1200x630.png'
        /> 

        <div className={styles.middleHeader}>
          <Grid container spacing={4}>
            <Grid item lg={1}><AfgIcon faIcon={faMoneyBill1Wave} backgroundColor="#666666" /></Grid>
            <Grid item lg={11}>
              <h3 className={styles.middleHeaderHeading}>How have federal revenue and spending affected the <span className={styles.deficitText}>deficit</span> and federal <span className={styles.debtText}>debt</span> so far in fiscal year YYYY? </h3>
            </Grid>
          </Grid>
        </div>


        <TopicSection
          heading='The amount by which spending exceeds revenue, $X.X in YYYY, is referred to as deficit spending.'
          body='A budget deficit occurs when the money spent exceeds the money collected for a given period.'
          linkUrl='/national-deficit'
          linkText='Learn more about national deficit'
          linkColor='#B3532D'
          image='/topics-section-images/homepage_deficit_1200x630.png'
        />
        <TopicSection
          heading='In YYYY, the federal government has $X.X in federal debt.'
          body="The national debt is the money the federal government has borrowed to cover the outstanding balance of expenses incurred over time. To pay for a deficit, the federal government borrows additional funds, which increases the debt. Other activities contribute to the change in federal debt, such as changes in the Treasury's operating cash account and federal student loans.  

          Are federal debt and deficit the same thing? No, but they do affect one another"
          linkUrl='/national-debt'
          linkText='Learn more about national debt'
          linkColor='#4a0072'
          image='/topics-section-images/homepage_debt_1200x630.png'
        />

        <div className={styles.comparisonSection}>
          <h3 className={styles.comparisonHeading}>How did these totals compare to YYYY year-end? </h3>
          <Grid className="comparisonGrid" container spacing={4}>
            <Grid item lg>
              <div className="comparisonSectionIcon">
              <AfgIcon faIcon={faHandHoldingDollar} backgroundColor="#0a2f5a" />
              </div>
                
              <div className="comparisonSectionHeading"></div>
              <div className="comparisonSectionBody"></div>
            </Grid>
          </Grid>
        </div>

      </Container>
        
    </SiteLayout>
    

  )
}
