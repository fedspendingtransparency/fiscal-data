import React from 'react';
import { listRoot, listRow, rowTitle, tile, tiles } from '../testing-guide.module.scss';
import CustomLink from '../../../components/links/custom-link/custom-link';

const RelatedDatasets = ({ specs }) => {
  const matches = specs && Object.keys(specs);

  return (
    <>
      {matches && matches.length > 0 && (
        <ul className={listRoot}>
          {matches?.map(spec => {
            const { matchingFeatures, dataset } = specs[spec] || {};
            return (
              <li key={spec} className={listRow}>
                <span className={rowTitle}>
                  <CustomLink url={`/datasets${dataset?.slug}`}>{spec}</CustomLink>
                  <div className={tiles}>
                    {matchingFeatures.map(feature => {
                      return <div className={tile}>{feature.label}</div>;
                    })}
                  </div>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {matches && matches.length === 0 && <span>No Matching Datasets</span>}
    </>
  );
};

export default RelatedDatasets;
