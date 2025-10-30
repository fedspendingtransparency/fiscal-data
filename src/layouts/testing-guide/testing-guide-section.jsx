import React from 'react';
import FeatureDisplay from './feature-display';
import HeaderChip from '../explainer/sections/overview/components/header-chip/header-chip';
import { section } from './testing-guide.module.scss';

const TestingGuideSection = ({ header, specs }) => {
  return (
    <>
      {specs && specs.length > 0 && (
        <div className={section}>
          <HeaderChip text={header} color="#0071bc" />
          <div>
            {specs?.map(spec => {
              return <FeatureDisplay spec={spec} />;
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default TestingGuideSection;
