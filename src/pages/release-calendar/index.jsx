import React from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
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
      <PageHelmet pageTitle="Fiscal Data Release Calendar" description={tagLineText} keywords="" />
      <div>
        {/*<ThemeProvider theme={theme}>*/}
        {/*  <div className="pageHeader">*/}
        {/*    <div className="content">*/}
        {/*      <BreadCrumbs links={breadCrumbLinks} />*/}
        {/*      <h1 data-testid="page-title" className={pageTitle}>*/}
        {/*        Release Calendar*/}
        {/*      </h1>*/}
        {/*      <p className={tagLine} data-testid="tag-line">*/}
        {/*        {tagLineText}*/}
        {/*      </p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <CalendarEntriesList />*/}
        {/*</ThemeProvider>*/}
      </div>
    </SiteLayout>
  );
};

export default ReleaseCalendar;
