import React from "react";
import { diveDeeperLink } from "../../national-debt/national-debt.module.scss";
import CustomLink from "../../../../../components/links/custom-link/custom-link";


const DeficitLearnMore = () => {
  const links = [
    {
      title: 'America’s Fiscal Future',
      url: 'https://www.gao.gov/americas-fiscal-future'
    },
    {
      title: 'An Update to the Budget and Economic Outlook: 2021 to 2031',
      url: 'https://www.cbo.gov/publication/57339'
    },
    {
      title: 'Congressional Budget Office Topics – Budget',
      url: 'https://www.cbo.gov/topics/budget'
    },
    {
      title: 'Federal Deficits, Growing Debt, and the Economy in the Wake of COVID 19',
      url: '/national-deficit/'
    },
    {
      title: 'President’s Budget – Historical Tables',
      url: 'https://www.whitehouse.gov/omb/historical-tables/'
    },
    {
      title: 'Monthly Treasury Statement',
      url: 'https://fiscaldata.treasury.gov/static-data/published-reports/mts/MonthlyTreasuryStatement_202109.pdf'
    },
    {
      title: 'U.S. Current Account Deficit Widens in Third Quarter 2021',
      url: 'https://www.bea.gov/news/blog/2021-12-20/us-current-account-deficit-widens-third-quarter-2021'
    },

  ];
  return (
  <>
    <p>
      For more information about the national deficit, please explore more of Fiscal Data and check
      out the extensive resources listed below.
    </p>
    { links.map((link) =>
      <div className={diveDeeperLink}>
        <strong>{link.title}</strong>
        <br />
        <CustomLink url={link.url}>
          {link.url}
        </CustomLink>
      </div>
    )}
  </>
)
};

export default DeficitLearnMore;
