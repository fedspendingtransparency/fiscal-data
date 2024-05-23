import React from 'react';
import ApiQuickGuideSection from '../api-quick-guide-section';
import FieldsAccordion from './fields/fields';
import FiltersAccordion from './filters/filters';
import SortingAccordion from './sorting/sorting';
import FormatAccordion from './format/format';
import PaginationAccordion from './pagination/pagination';
import CustomLink from '../../links/custom-link/custom-link';

const Accordions = ({ selectedTable, tabindex }) => {
  const numOfFields = 5;
  const methods = {
    title: 'Parameters',
    desc: (
      <>
        Refer to{' '}
        <CustomLink url={'#dataset-properties'} tabindex={tabindex}>
          Dataset Properties
        </CustomLink>{' '}
        above for a data dictionary with field names and descriptions as well as notes and known limitations
      </>
    ),
  };

  return (
    <ApiQuickGuideSection title={methods.title} description={methods.desc}>
      <FieldsAccordion selectedTable={selectedTable} numberOfFields={numOfFields} tabindex={tabindex} />
      <FiltersAccordion selectedTable={selectedTable} tabindex={tabindex} />
      <SortingAccordion selectedTable={selectedTable} tabindex={tabindex} />
      <FormatAccordion selectedTable={selectedTable} tabindex={tabindex} />
      <PaginationAccordion selectedTable={selectedTable} tabindex={tabindex} />
    </ApiQuickGuideSection>
  );
};

export default Accordions;
