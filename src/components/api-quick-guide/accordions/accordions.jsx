import React from 'react';
import ApiQuickGuideSection from '../api-quick-guide-section';
import FieldsAccordion from './fields/fields';
import FiltersAccordion from './filters/filters';
import SortingAccordion from './sorting/sorting';
import FormatAccordion from './format/format';
import PaginationAccordion from './pagination/pagination';
import CustomLink from "../../links/custom-link/custom-link";

const Accordions = ({ selectedTable }) => {

  const numOfFields = 5;
  const methods = {
    title: 'Parameters',
    desc: <>
            Refer to{' '}
            <CustomLink url={'#about-this-dataset'}>
              About This Dataset
            </CustomLink>
            {' '}above for a data dictionary with field names and{' '}
            descriptions as well as notes and known limitations
          </>
  };

  return (
    <ApiQuickGuideSection title={methods.title} description={methods.desc}>
      <FieldsAccordion selectedTable={selectedTable} numberOfFields={numOfFields} />
      <FiltersAccordion selectedTable={selectedTable} />
      <SortingAccordion selectedTable={selectedTable} />
      <FormatAccordion selectedTable={selectedTable} />
      <PaginationAccordion selectedTable={selectedTable} />
    </ApiQuickGuideSection>
  )
};

export default Accordions;
