import CustomLink from '../../links/custom-link/custom-link';
import React from 'react';
import { apiErrorStyle, overlay } from '../dtg-table.module.scss';

export default function DtgTableApiError() {
  return (
    <>
      <div data-test-id="error-overlay" className={overlay} />
      <div data-testid="api-error" className={apiErrorStyle}>
        <p>
          <strong>Table failed to load.</strong>
        </p>
        <p>
          There was an error with our API and we are unable to load this table. Please try your request again or{' '}
          <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us">contact us</CustomLink> for assistance.
        </p>
      </div>
    </>
  );
}
