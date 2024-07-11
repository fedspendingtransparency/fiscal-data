import { footerStyle } from './us-government-spending-chart.module.scss';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import React from 'react';
import useGAEventTracking from '../../../../../hooks/useGAEventTracking';
import Analytics from '../../../../../utils/analytics/analytics';
import styled, { keyframes } from 'styled-components';

const mts = (
  <CustomLink
    url="/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government"
    eventNumber="15"
    id="Monthly Treasury Statement"
  >
    Monthly Treasury Statement (MTS)
  </CustomLink>
);

export const footer = (
  <div className={footerStyle}>
    Please note: Values displayed are outlays, which is money that is actually paid out by the government. Other sources, such as
    <CustomLink url="https://www.usaspending.gov/"> USAspending</CustomLink>, may display spending as obligations, which is money that is promised to
    be paid, but may not yet be delivered.
    <p>Visit the {mts} dataset to explore and download this data.</p>
  </div>
);

export const handleGAEventClick = (eventNumber, getGAEvent) => {
  const gaEvent = getGAEvent(eventNumber);
  Analytics.event({
    category: gaEvent?.eventCategory?.replace('Fiscal Data - ', ''),
    action: gaEvent?.eventAction,
    label: gaEvent?.eventLabel,
  });
};

const grow = width => keyframes`
  0% {
    width: 0;
    height: 2.5rem;
  }
  100% {
    width: ${width}%;
    height: 2.5rem;
  }`;

export const GrowDivBar = styled.div`
  animation: ${props => props.animateTime}s ${props => props.animate && grow(props.percent * (props.isMobile ? 1 : 2))};
  animation-timing-function: ease-in;
  background: #00766c;
  width: ${props => props.percent * (props.isMobile ? 1 : 2)}%;
  margin-right: 10px;
  height: 40px;
`;
