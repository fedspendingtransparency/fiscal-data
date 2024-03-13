import React, { useState } from 'react';
import { listContainer } from './chart-description.module.scss';
import ScrollContainer from '../../../../../../../components/scroll-container/scroll-container';

const ChartDescription = () => {
  const [scrollTop, setScrollTop] = useState(true);
  const descriptionList = [
    {
      header: 'A-D',
      description:
        'Issued from 1935–1941, these early bonds, or “Baby Bonds” were developed to be a widely accessible type of security ' +
        'to help fund government efforts to alleviate unemployment. They earned the name “Baby Bonds” due to the low starting ' +
        'price of only $25.',
    },
    {
      header: 'E',
      description:
        'Issued from 1941–1980, E bonds were created in response to World War II and were known as “Defense Bonds” and then ' +
        '“War Bonds”. E Bonds were also the “world’s most widely held security”. They were offered in denominations from $25 ' +
        'to $10,000, with special “memorial” denominations of $200 for President Roosevelt (1945) and $75 for President Kennedy (1964).',
    },
    {
      header: 'EE',
      description:
        'First issued in 1980 and still available today, the EE bond was modeled after the E bond; however, the EE bond' +
        'sells at 50% of the face value while E bonds were offered at 75% of face value. EE bonds sold between 2001 and 2011 were ' +
        'designated as “Patriot Bonds” as a way for Americans to express support for anti-terrorism efforts.',
    },
    {
      header: 'F',
      description:
        'Issued from 1941–1952, F bonds were developed for and targeted toward all investors except commercial banks. These ' +
        'bonds earned interest that was paid when the bond was cashed and could be purchased at 74% of face value. F ' +
        '' +
        'bonds were replaced by J bonds.',
    },
    {
      header: 'G',
      description:
        'Issued from 1941–1952, G bonds were developed for and targeted toward all investors except commercial banks. These ' +
        'bonds were considered “current-income”, which meant that they earned interest that was paid every six months, ' +
        'rather than in one lump sum when the bond was redeemed. G bonds were replaced by K bonds.',
    },
    {
      header: 'H',
      description:
        'Issued from 1952–1979, H bonds were designed to be companion savings bonds to E bonds. They earned the same ' +
        'interest rate but were “current-income” bonds that earned interest that was paid every six months, rather ' +
        'than in one lump sum when the bond was redeemed. H bonds were replaced by HH bonds.',
    },
    {
      header: 'I',
      description:
        'Issued initially in 1998 and still available today, I bonds earn a fixed rate of interest and a variable rate ' +
        'based on inflation. From 2006–2007, a special designation of I bonds known as “Gulf Coast Recovery Bonds” were ' +
        'issued to encourage support for recovery efforts in the region damaged by hurricanes.',
    },
    {
      header: 'J',
      description:
        'Issued from 1952–1967, J bonds replaced F bonds. They offered a higher interest rate, had an increased purchase ' +
        'limit of $200,000, and sold for 72% of the face value (versus the I bonds’ 74%).',
    },
    {
      header: 'K',
      description: 'Issued from 1952–1957, K bonds replaced G bonds with a higher interest rate of 2.76% (versus G bonds’ 2.53%)',
    },
    {
      header: 'SN',
      description:
        'Issued from 1967–1970, these Savings Notes (Freedom Shares) could be purchased at 81% of face value and were ' +
        'investment bonds, where bond holders received accrued interest when the bonds were redeemed.',
    },
    {
      header: 'HH',
      description: 'Sold from 1980–2004, HH bonds replaced H bonds but with different interest rates. HH bonds earn interest' + 'for up to 20 years',
    },
  ];
  return (
    <div style={{ display: 'block' }}>
      <ScrollContainer scrollTop={scrollTop} setScrollTop={setScrollTop} list={descriptionList}>
        <div className={listContainer}>
          {descriptionList.map((bond, index) => {
            return (
              <React.Fragment key={index}>
                <h5>{bond.header}</h5>
                <p>{bond.description}</p>
              </React.Fragment>
            );
          })}
        </div>
      </ScrollContainer>
    </div>
  );
};

export default ChartDescription;
