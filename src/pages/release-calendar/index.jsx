import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from '../../theme';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import SiteLayout from "../../components/siteLayout/siteLayout";
import PageHelmet from '../../components/page-helmet/page-helmet';
import CalendarEntriesList from '../../components/calendar-entries/calendar-entries';
import * as styles from './release-calendar.module.scss';

export const tagLineText = `
  This Fiscal Data Release Calendar shows estimated dates and times for upcoming data releases.
  Please note all times on the calendar are in Eastern Time.
`;

const ReleaseCalendar = () => {
  const breadCrumbLinks = [
    {
      name: 'Release Calendar'
    },
    {
      name: 'Home',
      link: '/'
    }
  ];

  return (
    <SiteLayout>
      <PageHelmet
        pageTitle="Fiscal Data Release Calendar"
        description={tagLineText}
        keywords=""
      />
      <MuiThemeProvider theme={theme}>
        <div className="pageHeader">
          <div className="content">
            <BreadCrumbs links={breadCrumbLinks} />
            <h1 data-testid="page-title" className={styles.pageTitle}>Release Calendar</h1>
            <p className={styles.tagLine} data-testid="tag-line">
              {tagLineText}
            </p>
          </div>
        </div>
        <CalendarEntriesList />
      </MuiThemeProvider>
    </SiteLayout>
  )
};

export default ReleaseCalendar;
