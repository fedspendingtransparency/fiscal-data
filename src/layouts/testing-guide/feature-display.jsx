import React from 'react';
import CustomLink from '../../components/links/custom-link/custom-link';
import { accordionContainer, features, matchingDatasets, matchingSpec } from './testing-guide.module.scss';
import Accordion from '../../components/accordion/accordion';

const FeatureDisplay = ({ spec }) => {
  return (
    <div className={features}>
      <Accordion title={spec.label} containerClass={accordionContainer}>
        <div className={matchingSpec}>
          {spec.description && (
            <div>
              <b>Description: </b>
              {spec.description}
            </div>
          )}
        </div>
        <div className={matchingDatasets}>
          <b>Related Datasets to Test:</b>
          {spec.matchingDatasets.map(dataset => (
            <CustomLink url={'/datasets' + dataset.slug}>{dataset.name}</CustomLink>
          ))}
          {spec.matchingDatasets.length === 0 && <>No matching datasets</>}
        </div>
      </Accordion>
    </div>
  );
};

export default FeatureDisplay;
