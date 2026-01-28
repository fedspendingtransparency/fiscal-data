import React from 'react';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import CalendarEntriesList from '../../components/calendar-entries/calendar-entries';
import { pageTitle, tagLine } from './release-calendar.module.scss';
import { tagLineText } from '../../helpers/release-calendar/release-calendar-content-helper';

const ReleaseCalendar = () => {
  const breadCrumbLinks = [
    {
      name: 'Release Calendar',
    },
    {
      name: 'Home',
      link: '/',
    },
  ];

  return (
    <SiteLayout>
      <ThemeProvider theme={theme}>
        <div className="pageHeader">
          <div className="content">
            <BreadCrumbs links={breadCrumbLinks} />
            <h1 data-testid="page-title" className={pageTitle}>
              Release Calendar
            </h1>
            <p className={tagLine} data-testid="tag-line">
              {tagLineText}
            </p>
          </div>
        </div>
        <CalendarEntriesList />
      </ThemeProvider>
    </SiteLayout>
  );
};

export default ReleaseCalendar;

export const Head = () => <PageHelmet pageTitle="Fiscal Data Release Calendar" description={tagLineText} keywords="" />;
