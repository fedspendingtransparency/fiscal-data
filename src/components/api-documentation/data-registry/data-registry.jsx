import React from 'react';
import SectionContent from '../section-content/section-content';
import * as apiStyles from '../../../pages/api-documentation/api.module.scss';
import GLOBALS from '../../../helpers/constants';
import CustomLink from '../../links/custom-link/custom-link';

const dataRegistryUrl = `${GLOBALS.FISCAL_TREASURY_URL}/data-registry/index.html`;
export const dataRegistryTitle = 'Fiscal Service Data Registry';

const DataRegistry = () => (
  <div className={apiStyles.sectionBreak}>
    <SectionContent id="data-registry" headingLevel={2} title={dataRegistryTitle}>
      <p>
        The <CustomLink url={dataRegistryUrl}>data registry</CustomLink> contains information about definitions, authoritative sources, data types,
        formats, and uses of common data across the federal government.
      </p>
    </SectionContent>
  </div>
);

export default DataRegistry;
