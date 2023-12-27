import React from 'react';
import SectionContent from '../section-content/section-content';
import { listHeading } from '../section-content/section-content.module.scss';
import { list } from './parameters.module.scss';
import Fields from '../fields/fields';
import Filters from '../filters/filters';
import Sorting from './sorting/sorting';
import Format from './format/format';
import Pagination from './pagination/pagination';

const Parameters = () => (
  <>
    <SectionContent id="parameters" headingLevel={2} title="Parameters">
      <p>
        <strong>Parameters</strong> can be included in an API request by modifying the URL. This will specify the criteria to determine which records
        will be returned, as well as the ordering and format of the data returned. More information about each parameter can be found below.
      </p>
      <p className={listHeading}>
        <strong>Available parameters</strong> include:
      </p>
      <ul className={list}>
        <li>Fields</li>
        <li>Filters</li>
        <li>Sorting</li>
        <li>Format</li>
        <li>Pagination</li>
      </ul>
    </SectionContent>
    <Fields />
    <Filters />
    <Sorting />
    <Format />
    <Pagination />
  </>
);

export default Parameters;
