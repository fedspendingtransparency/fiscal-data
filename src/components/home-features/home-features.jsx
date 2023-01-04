import React from 'react';
import {
  label,
  container,
  content,
  contentDesc,
  features,
  feature
} from './home-features.module.scss';

const contentSrc = {
  header: 'Designed with you in mind',
  desc: 'At Fiscal Data, we make it easy to find the data you need with tools and features like: '
};

export const featuresSrc = [
  {
    alt: 'A download graphic highlighting this feature found on Fiscal Data.',
    graphicSrc: '/features/download.svg',
    label: 'Machine-Readable Data',
    key: 'downloads'
  },
  {
    alt: 'A time graphic highlighting this feature found on Fiscal Data.',
    graphicSrc: '/features/db-refresh.svg',
    label: 'Historical & Current Data',
    key: 'data'
  },
  {
    alt: 'A list graphic highlighting this feature found on Fiscal Data.',
    graphicSrc: '/features/documents.svg',
    label: 'Comprehensive Metadata',
    key: 'metadata'
  },
  {
    alt: 'An API graphic highlighting this feature found on Fiscal Data.',
    graphicSrc: '/features/plug.svg',
    label: 'Easily Accessible APIs',
    key: 'apis'
  },
  {
    alt: 'A magnifying glass graphic highlighting this feature found on Fiscal Data.',
    graphicSrc: '/features/magnifier.svg',
    label: 'Adjustable Data Previews',
    key: 'previews'
  },
  {
    alt: 'A book graphic highlighting this feature found on Fiscal Data.',
    graphicSrc: '/features/open-book.svg',
    label: 'Detailed Data Dictionaries',
    key: 'dataDict'
  }
];

const HomeFeatures = () => {
  return (
    <div className={container}>
      <div className={content}>
        <h2>
          {contentSrc.header}
        </h2>
        <p className={contentDesc}>
          {contentSrc.desc}
        </p>
      </div>
      <div className={features}>
        {featuresSrc.map((f) => {
          return (
            <div key={f.key} className={feature}>
              <img src={f.graphicSrc} aria-hidden='true' alt={f.alt} height={143} width={143} />
              <div className={label}>
                {f.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeFeatures;
