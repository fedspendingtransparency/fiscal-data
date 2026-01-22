import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons/faFileInvoiceDollar';
import { faCoins } from '@fortawesome/free-solid-svg-icons/faCoins';
import { faFunnelDollar } from '@fortawesome/free-solid-svg-icons/faFunnelDollar';
import curvedArrow from '../../../../../../images/curved-arrow.svg';
import React from 'react';
import { nationalDebtExplainedTable, tableIcon, borderBottom } from '../national-debt-explained.module.scss';
export const nationalDebtExplainedTableContent = {
  header: [
    null,
    <FontAwesomeIcon icon={faCoins} className={tableIcon} />,
    <FontAwesomeIcon icon={faFunnelDollar} className={tableIcon} />,
    <FontAwesomeIcon icon={faFileInvoiceDollar} className={tableIcon} />,
    null,
  ],
  body: [
    [null, 'Revenue', 'Spending', 'Deficit', null],
    ['Year 1', '$400', '$500', '-$100', null],
    ['Year 2', '$600', '$800', '-$200', null],
    [null, null, null, '-$300', 'Debt'],
  ],
  footer: [null, null, null, <img src={curvedArrow} alt="" />],
};
const NationalDebtExplainedTable = () => {
  return (
    <>
      <div
        className={nationalDebtExplainedTable}
        role="img"
        aria-label={
          'A financial diagram showing fictional budget information with purple icons and text. The image has three columns ' +
          'labeled "Revenue" (with a stacked coins icon), "Spending" (with a funnel and dollar sign icon), and "Deficit" (with a document ' +
          'and dollar sign icon). The data shows Year 1 with $400 revenue and $500 spending resulting in a -$100 deficit. Year 2 ' +
          'shows $600 revenue and $800 spending resulting in a -$200 deficit. At the bottom, these deficits sum to -$300, labeled ' +
          'as "Debt" with a curved arrow pointing to it.'
        }
      >
        <table>
          <thead>
            <tr>
              {nationalDebtExplainedTableContent.header.map((th, i) => (
                <th key={i}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nationalDebtExplainedTableContent.body.map((tb, i) => (
              <tr key={i}>
                {tb.map((t, j) => {
                  // second-to-last element in second-to-last row before footer
                  const borderBottomEl = i === nationalDebtExplainedTableContent.body.length - 2 && j === tb.length - 2;

                  // last element in last row before footer
                  const boldEl = i === 0 || (i === nationalDebtExplainedTableContent.body.length - 1 && j === tb.length - 1);

                  return (
                    <td className={borderBottomEl ? borderBottom : ''} key={j}>
                      {boldEl ? <strong>{t}</strong> : t}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              {nationalDebtExplainedTableContent.footer.map((tf, i) => (
                <td colSpan={tf !== null ? 2 : 1} key={i}>
                  {tf}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default NationalDebtExplainedTable;
