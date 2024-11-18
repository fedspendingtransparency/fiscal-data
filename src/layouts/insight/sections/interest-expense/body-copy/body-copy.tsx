import CustomLink from '../../../../../components/links/custom-link/custom-link';
import React, { ReactElement } from 'react';

export const BodyCopy = (): ReactElement => (
  <div>
    Interest Expense is the interest the government pays on its outstanding loans (Treasury securities). It can be referred to as the cost to the U.S.
    for borrowing money. The amount of interest expense depends on the total federal debt and the interest rates investors charged when they loaned
    the money. Average interest rates are a useful measure for showing general trends in the interest the government pays on its loans, even though
    the true cost of the loans will vary by security type and by the interest rate for those securities when the loan was taken. To see a breakdown of
    average rates by security, visit the{' '}
    <CustomLink url={'/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities'}>
      Average Interest Rates on U.S. Treasury Securities
    </CustomLink>{' '}
    dataset.
  </div>
);
