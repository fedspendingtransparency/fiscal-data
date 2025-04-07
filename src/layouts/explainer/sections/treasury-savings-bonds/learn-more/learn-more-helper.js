import React from 'react';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import { analyticsEventHandler } from '../../../explainer-helpers/explainer-helpers';

export const getSaleBondsFootNotes = () => {
  const footnoteGaEvent = () => analyticsEventHandler('A History of the United States Savings Bonds Program', 'Savings Bonds Citation Click');

  return [
    {
      anchors: [{ text: '1', link: 'savings-bonds-overview' }],
      definition: (
        <>
          <CustomLink url="https://www.treasurydirect.gov/files/research-center/history-of-savings-bond/history-sb.pdf" onClick={footnoteGaEvent}>
            A History of the United States Savings Bonds Program
          </CustomLink>
          , page 5
        </>
      ),
    },
    {
      anchors: [{ text: '2', link: 'what-influences-the-purchase-of-savings-bonds' }],
      definition: (
        <>
          <CustomLink url="https://www.treasurydirect.gov/files/research-center/history-of-savings-bond/history-sb.pdf" onClick={footnoteGaEvent}>
            A History of the United States Savings Bonds Program
          </CustomLink>
          , page 3
        </>
      ),
    },
  ];
};
