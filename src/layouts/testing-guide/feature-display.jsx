import React from 'react';
import CustomLink from '../../components/links/custom-link/custom-link';
import Accordion from '../../components/accordion/accordion';
import { accordionContainer, features, matchingSpec, matchingDatasets, listRoot, listRow, rowTitle } from './testing-guide.module.scss';

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
          <ul className={listRoot}>
            {spec.matchingDatasets.map(d => (
              <li key={d.slug} className={listRow}>
                <span className={rowTitle}>
                  <CustomLink url={`/datasets${d.slug}`}>{d.name}</CustomLink>
                </span>
              </li>
            ))}
          </ul>
          {spec.matchingDatasets.length === 0 && <>No matching datasets</>}
        </div>
      </Accordion>
    </div>
  );
};

export default FeatureDisplay;
