import React from 'react';
import HeaderChip from '../explainer/sections/overview/components/header-chip/header-chip';
import { section } from './testing-guide.module.scss';
import RelatedDatasets from './related-datasets/related-datasets';
import CurrentFeatures from './current-features/current-features';

const TestingGuideSection = ({ header, matches, specs }) => {
  console.log(specs);

  return (
    <>
      {specs && specs.length > 0 && (
        <div className={section}>
          <HeaderChip text={header} color="#0071bc" />
          <CurrentFeatures specs={specs} />
          <RelatedDatasets specs={matches} />
        </div>
      )}
    </>
  );
};

export default TestingGuideSection;
