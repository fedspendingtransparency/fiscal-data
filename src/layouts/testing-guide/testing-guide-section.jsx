import React from 'react';
import HeaderChip from '../explainer/sections/overview/components/header-chip/header-chip';
import { accordionContainer, features, link, matchingDatasets, matchingSpec, section } from './testing-guide.module.scss';
import Accordion from '../../components/accordion/accordion';
import CustomLink from '../../components/links/custom-link/custom-link';

const TestingGuideSection = ({ header, specs }) => {
  return (
    <>
      {specs && specs.length > 0 && (
        <div className={section}>
          <HeaderChip text={header} color="#0071bc" />
          <div>
            {specs?.map(spec => {
              return (
                <div className={features}>
                  <Accordion title={spec.label} containerClass={accordionContainer}>
                    <div className={matchingSpec}>
                      {spec.description && (
                        <>
                          <b>Description: </b>
                          <div>{spec.description}</div>
                        </>
                      )}
                    </div>
                    <div className={matchingDatasets}>
                      <b>Related Datasets to Test:</b>
                      {spec.matchingDatasets.map(dataset => (
                        <div className={link}>
                          <CustomLink url={'/datasets' + dataset.slug}>{dataset.name}</CustomLink>
                        </div>
                      ))}
                      {spec.matchingDatasets.length === 0 && <>No matching datasets</>}
                    </div>
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default TestingGuideSection;
