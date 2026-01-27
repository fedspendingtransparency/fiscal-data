import fetchMock from 'fetch-mock';

const mockMetaData = [
  {
    dataset_id: '015-BFS-2014Q3-yy',
    title: 'State and Local Government Series Securities (Non-Marketable)',
    long_description:
      'The State and Local Government Series Securities (Non-Marketable) dataset details how many non-marketable State and Local Government Securities (SLGS) have been sold and their value, reported each month. This dataset also includes information about how many bonds have yet to mature and their timeline to maturity, organized in various buckets: 0-3 months to maturity, 3-6 months, etc.',
    short_description:
      'Information about non-marketable State and Local Government Securities that have been sold, their value, and their timeline to maturity.',
    notes_and_known_limitations:
      'Non-marketable securities are unable to be sold in secondary markets. Some columns in this dataset overlap with the [U.S. Treasury Monthly Statement of the Public Debt (MSPD)](https://fiscaldata.treasury.gov/datasets/monthly-statement-public-debt/) dataset.',
    publisher: 'Fiscal Accounting',
    update_frequency: 'Daily',
    metadata_complete: 1,
    dataset_path: 'slgs-securities',
    pdf_path: null,
    master_static_filename: null,
  },
  {
    dataset_id: '015-BFS-2014Q3-059',
    title: 'State and Local Government Series (SLGS) Daily Rate Table',
    long_description:
      'The State and Local Government Series (SLGS) Daily Rate Table dataset provides interest rates for time deposit securities with a maturity of one month up to 40 years and a daily rate for Demand Deposit securities.',
    short_description: 'Interest rates for time deposit securities with a maturity of one month up to 40 years and a daily rate for demand deposits.',
    notes_and_known_limitations:
      'SLGS securities are offered for sale to issuers of state and local government tax-exempt debt to assist with compliance of yield restriction or arbitrage rebate provisions of the Internal Revenue Code.\n\nSubscribers may invest in time deposit or demand deposit types of securities.\n\nAll SLGS securities are issued in book-entry form and are non-marketable.\n\nDemand Deposit Rates:\nFor Demand Deposit securities, the interest rate is based on an adjustment of the average yield in the most recent auction of 13-week Treasury bills. The demand rate is a daily rate and is reset each day for outstanding Demand Deposit securities. As you can see, the Demand Deposit rate covers all Demand Deposit securities issued, regardless of the redemption date.\n\nTime Deposit Rates:\nFor Time Deposit securities, the interest rate earned is one basis point below the current Treasury borrowing rate for a security of comparable maturity. For Time Deposit securities, you must know the security life (i.e., term) to find your maximum allowable rate.\n\nThe column headings From and Through refer to the security life. If the security life is more than one time increment, but not quite the next increment, use the shorter term. For example, if the security will be held for 65 days, you would use the 00-02 (two month) rate, not the 00-03 (three month) rate. For instance, if you have a security that is issued September 30, 2013, and matures September 30, 2014, then the security life is exactly 1 year.\n\nIf the security term is 01-00 (meaning one year, zero months) and the rate listed is 0.11% the maximum interest rate available is 0.11%. You may also choose any interest rate from 0% to 0.11% for your security. You are not required to accept the maximum allowable rate, but you cannot choose an interest rate higher than the maximum allowable rate. See a more [detailed interpretation of the SLGS Daily Rate Table From and Through columns](https://fiscaldata.treasury.gov/static-data/published-reports/slgs-daily-rate/SLGSRateTableHelp.pdf).',
    publisher: 'Fiscal Accounting',
    update_frequency: 'Daily',
    metadata_complete: 1,
    dataset_path: 'slgs-daily-rate-table',
    pdf_path: null,
    master_static_filename: 'SLGS_DailyRateTable',
  },
  {
    dataset_id: '015-BFS-2014Q1-14',
    title: 'Record-Setting Treasury Securities Auction Data',
    long_description:
      'Record-Setting Treasury Securities Auction Data provides record highs and lows from U.S. Treasury auctions. This includes lowest and highest rates/yields, highest offering amount, and highest bid-to-cover ratios as well as the dates for these record-setting auctions. The data also indicates the security type and term. Security types include Treasury Bills, Treasury Notes, Treasury Bonds, Cash Management Bills (CMBs), Floating Rate Notes (FRNs), and Treasury Inflation-Protected Securities (TIPS). Security terms range from a few days for CMBs to 30-year securities. The U.S. Treasury uses an auction process to sell these marketable securities and determine their rate or yield. Marketable securities can be bought, sold, or transferred after they are originally issued.',
    short_description:
      'Record highs and lows from Treasury securities auctions, including rates and yields, offers, security type and term, and the date of the record-setting auction.',
    notes_and_known_limitations:
      'This data is limited to marketable securities, meaning securities that can be bought, sold, or transferred after they are originally issued. This dataset represents marketable Treasury securities auctioned since implementation of single-priced auctions for each security term. The record-setting data refers to securities by auction date. The highest and lowest auction results are unique to the security type being auctioned. Rates records applies to Bills and Cash Management Bills (CMBs). Yield records apply to Notes, Bonds and Treasury Inflation-Protected Securities (TIPS). Discount Margin records apply to Floating Rate Notes (FRNs).',
    publisher: 'Wholesale Securities Services',
    update_frequency: 'As Needed',
    metadata_complete: 1,
    dataset_path: 'record-setting-auction-data',
    pdf_path: null,
    master_static_filename: null,
  },
];

const mockReleaseData = [
  {
    datasetId: '015-BFS-2014Q3-059',
    date: '2023-11-22',
    time: '1500',
    released: 'true',
    dataset: {
      name: 'State and Local Government Series (SLGS) Daily Rate Table',
      slug: '/slgs-daily-rate-table/',
    },
  },
  {
    datasetId: '015-BFS-2014Q3-yy',
    date: '2023-11-22',
    time: '1600',
    released: 'true',
    dataset: {
      name: 'State and Local Government Series Securities (Non-Marketable)',
      slug: '/slgs-securities/',
    },
  },
  {
    datasetId: '015-BFS-2014Q1-14',
    date: '2023-11-22',
    time: '1900',
    released: 'false',
    dataset: {
      name: 'Record-Setting Treasury Securities Auction Data',
      slug: '/record-setting-auction-data/',
    },
  },
];

describe('Release Calendar', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    fetchMock.get(`https://api.fiscaldata.treasury.gov/services/calendar/release`, mockReleaseData, { overwriteRoutes: true, repeat: 0 });
    fetchMock.get('https://api.fiscaldata.treasury.gov/services/dtg/metadata/', mockMetaData, { overwriteRoutes: true, repeat: 0 });
  });
  it('should ', () => {
    expect(true);
  });

  // it('includes the SiteLayout component', async () => {
  //   const fetchSpy = jest.spyOn(global, 'fetch');
  //   const { findByTestId } = render(
  //     <RecoilRoot>
  //       <ReleaseCalendar />
  //     </RecoilRoot>
  //   );
  //   await waitFor(() => expect(fetchSpy).toBeCalled());
  //   const siteLayout = await findByTestId('officialBanner');
  //   // officialBanner is included in SiteLayout component
  //   expect(siteLayout).toBeInTheDocument();
  // });
  //
  // it('includes breadcrumbs', async () => {
  //   const fetchSpy = jest.spyOn(global, 'fetch');
  //   const { getByRole } = render(
  //     <RecoilRoot>
  //       <ReleaseCalendar />
  //     </RecoilRoot>
  //   );
  //   await waitFor(() => expect(fetchSpy).toBeCalled());
  //   const homeLink = await getByRole('link', { name: 'Home' });
  //   expect(homeLink).toBeInTheDocument();
  // });
  //
  // it('includes the page title and tagline', async () => {
  //   const fetchSpy = jest.spyOn(global, 'fetch');
  //   const { getByRole, getByText } = render(
  //     <RecoilRoot>
  //       <ReleaseCalendar />
  //     </RecoilRoot>
  //   );
  //   await waitFor(() => expect(fetchSpy).toBeCalled());
  //   const pageTitle = await getByRole('heading', { level: 1, name: 'Release Calendar' });
  //   const tagline = await getByText('The Fiscal Data Release Calendar', { exact: false });
  //   expect(pageTitle).toBeInTheDocument();
  //   expect(tagline).toBeInTheDocument();
  // });
});
