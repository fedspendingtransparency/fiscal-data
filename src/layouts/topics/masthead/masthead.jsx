import React from 'react';
import BreadCrumbs from '../../../components/breadcrumbs/breadcrumbs';
import { bottomMargin, relatedTopics, titleStyle, topic } from './masthead.module.scss';

export default function MastHead({ title }) {
  const breadCrumbLinks = [
    {
      name: title,
    },
    {
      name: 'Home',
      link: '/',
    },
  ];

  const tagLine = (
    <>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
      anim id est laborum.
    </>
  );

  return (
    <div className={`pageHeader ${bottomMargin}`}>
      <div className="content">
        <BreadCrumbs links={breadCrumbLinks} />
        <h1 data-test-id="pageTitle" className="title">
          {title}
        </h1>
        <p data-test-id="tagLine">{tagLine}</p>
        <div data-test-id="relatedTopics" className={relatedTopics}>
          <h2 className={titleStyle}>Related Topics:</h2>
          <div className={topic}>Financial Summaries</div>
          <div className={topic}>Interest & Exchange Rates</div>
        </div>
      </div>
    </div>
  );
}
