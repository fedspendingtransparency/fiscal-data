import React from 'react';
import CustomLink from '../../../components/links/custom-link/custom-link';
import { features, matchingDatasets, matchingSpec } from './testing-guide.module.scss';

const FeatureDisplay = ({ spec }) => {
  return (
    <div className={features}>
      <div className={matchingSpec}>
        <div>
          <b>Feature: </b>
          {spec.label}
        </div>
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
    </div>
  );
};

export default FeatureDisplay;
