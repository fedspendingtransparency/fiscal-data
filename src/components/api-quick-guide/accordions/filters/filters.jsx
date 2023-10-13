import React from 'react';
import Accordion from '../../../accordion/accordion';
import { list, exampleTitle, exampleParameters, codeBlock } from '../accordions.module.scss';
import { filterParameter, indentedFilters } from './filters.module.scss';
import GLOBALS from '../../../../helpers/constants';

const FiltersAccordion = ({ selectedTable }) => {
  const baseApiUrl = GLOBALS.PROD_API_BASE_URL;
  const fullUrl = `${baseApiUrl}/${selectedTable.endpoint}`;
  let dateString = '2020-05-31'; // dummy value in case theres a problem with latestDate
  if (selectedTable && selectedTable.apiId && selectedTable.latestDate) {
    const dateParts = selectedTable.latestDate.split('/');
    const latestDateFormatted = dateParts.length > 2 ? `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}` : selectedTable.latestDate;
    dateString = GLOBALS.ENDPOINTS_WITH_YEAR_MONTH_DATE_FORMAT.includes(selectedTable.apiId.toString())
      ? latestDateFormatted.slice(0, -3)
      : latestDateFormatted;
  }

  const exampleFilterQuery = `?filter=${selectedTable.dateField}:eq:${dateString}`;

  return (
    <Accordion title="Filters">
      <ul className={list}>
        <li>
          <strong>Parameter: </strong>
          <code className="inline">filter=</code>
        </li>
        <li>
          <strong>Definition: </strong>
          Filters are used to view a subset of the data based on specific criteria. For example, you may want to find data that falls within a certain
          date range, or only show records which contain a value larger than a certain threshold.
        </li>
        <li>
          <strong>Accepts: </strong>
          The filter parameter <code className="inline">filter=</code> accepts filters from the list below, as well as specified filter criteria. Use
          a colon at the end of a filter parameter to pass a value or list of values. For lists passed as filter criteria, use a comma-separated list
          within parentheses. Filter for specific dates using the format <code className="inline">YYYY-MM-DD</code>.
        </li>
        <li>
          <strong>Required: </strong>
          No, filters are not required to make an API request.
        </li>
        <li>
          <strong>Default: </strong>
          When no filters are provided, the default response will <strong>return all fields and all data</strong>.
        </li>
      </ul>
      <div className={filterParameter}>
        The filter parameter <strong>accepts the following filters:</strong>
        <ul className={indentedFilters}>
          <li>
            <code className="inline">lt</code> = Less than
          </li>
          <li>
            <code className="inline">lte</code> = Less than or equal to
          </li>
          <li>
            <code className="inline">gt</code> = Greater than
          </li>
          <li>
            <code className="inline">gte</code> = Greater than or equal to
          </li>
          <li>
            <code className="inline">eq</code> = Equal to
          </li>
          <li>
            <code className="inline">in</code> = Contained in a given set
          </li>
        </ul>
      </div>
      <div className={exampleTitle}>EXAMPLE</div>
      <code className={`${codeBlock} large`}>
        <div data-testid="filtersAccordionQuery" className={exampleParameters}>
          {exampleFilterQuery}
        </div>
        <div data-testid="fullUrl">
          {fullUrl}
          {exampleFilterQuery}
        </div>
      </code>
    </Accordion>
  );
};

export default FiltersAccordion;
