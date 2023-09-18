import React, { useEffect, useState } from 'react';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import { breakpointSm } from '../../../../../../variables.module.scss';
import {
  accordionFooter,
  accordionHeader,
  accordionTable,
  growingNationalDebtSectionAccordion,
  rectangle,
} from './visualizing-the-debt-accordion.module.scss';
import { debtAccordion } from '../../national-debt.module.scss';
import Accordion from '../../../../../../components/accordion/accordion';
import { visualizingTheDebtTableContent } from '../../national-debt';
import { useRecoilValueLoadable } from 'recoil';
import { debtToThePennyData } from '../../../../../../recoil/debtToThePennyDataState';

export const VisualizingTheDebtAccordion = ({ width }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState(visualizingTheDebtTableContent.desktop.rows);
  const [columns, setColumns] = useState(visualizingTheDebtTableContent.desktop.columns);
  const [nationalDebtValue, setNationalDebtValue] = useState('99999999999999.99');
  const [nationalDebtValueInTenths, setNationalDebtValueInTenths] = useState('99999999999999.9');
  const [numberOfSquares, setNumberOfSquares] = useState('0');
  const [dynamicGaEventValue, setDynamicGaEventValue] = useState(null);
  const data = useRecoilValueLoadable(debtToThePennyData);
  useEffect(() => {
    setIsLoading(false);

    if (width < pxToNumber(breakpointSm)) {
      setRows(visualizingTheDebtTableContent.mobile.rows);
      setColumns(visualizingTheDebtTableContent.mobile.columns);
    } else {
      setRows(visualizingTheDebtTableContent.desktop.rows);
      setColumns(visualizingTheDebtTableContent.desktop.columns);
    }
  }, [width]);

  const drawTable = () => {
    const table = [];

    for (let i = 0; i < rows; i++) {
      const row = [];

      for (let j = 0; j < columns; j++) {
        row.push(j);
      }

      table.push(
        <tr key={i} data-testid="accordion-table-row">
          {row.map(index => (
            <td key={index} className={rectangle} />
          ))}
        </tr>
      );
    }

    return <tbody>{table.map(tr => tr)}</tbody>;
  };

  useEffect(() => {
    if (data.state === 'hasValue') {
      const totalPublicDebtOutstanding = Math.trunc(data.contents[0]['tot_pub_debt_out_amt']);
      const dividedDebt = totalPublicDebtOutstanding / 1000000000000;
      setNationalDebtValue(dividedDebt.toFixed());
      setNationalDebtValueInTenths(dividedDebt.toFixed(1));
      setDynamicGaEventValue(dividedDebt.toFixed());
      setNumberOfSquares((dividedDebt * 1000).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }
  }, [data.state]);

  return (
    <div className={debtAccordion}>
      <Accordion
        title={`Visualizing the debt - How much is $${nationalDebtValue} trillion dollars?`}
        containerClass={growingNationalDebtSectionAccordion}
        openEventNumber={'20'}
        closeEventNumber={'21'}
        dynamicGaEventValue={dynamicGaEventValue}
        explainerGAEvent="Debt"
        ga4ID={'viz-debt'}
      >
        <div className={accordionHeader}>
          <p>If this is 1 billion:</p>
          <div className={rectangle} />
          <p>Then this is 1 trillion:</p>
        </div>
        {!isLoading && <table className={accordionTable}>{drawTable()}</table>}
        <div className={accordionFooter}>
          <p>(1000 squares drawn to scale.)</p>
          <p>{`Today's debt is $${nationalDebtValueInTenths} T. That's ${numberOfSquares} squares!`}</p>
        </div>
      </Accordion>
    </div>
  );
};
