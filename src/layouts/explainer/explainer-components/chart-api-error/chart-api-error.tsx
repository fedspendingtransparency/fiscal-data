import CustomLink from '../../../../components/links/custom-link/custom-link';
import React from 'react';
import { apiErrorStyle, apiErrorWrapper } from '../chart-api-error/chart-api-error.module.scss';

export default function ChartApiError() {
  return (
    <div className={apiErrorWrapper}>
      {/*<div data-testid="error-overlay" className={overlay} />*/}
      <div data-testid="api-error" className={apiErrorStyle}>
        <p>
          <strong>Chart failed to load.</strong>
        </p>
        <p>
          There was an error with our API and we are unable to load this chart. Please try your request again or{' '}
          <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us">contact us</CustomLink> for assistance.
        </p>
      </div>
    </div>
  );
}
