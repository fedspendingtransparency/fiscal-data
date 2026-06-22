import { debtExplainerPrimary } from '../../../explainer.module.scss';
import { deficitExplainerPrimary } from '../../national-deficit/national-deficit.module.scss';

export const legendItems = [
  { title: 'Debt', color: debtExplainerPrimary },
  { title: 'Deficit', color: deficitExplainerPrimary },
  { title: '= $1T', color: '#666666', shape: 'rectangle' },
];
export const debtEndpointUrl = '/v1/debt/mspd/mspd_table_1?filter=security_type_desc:eq:Total%20Public%20Debt%20Outstanding&sort=-record_date';
export const deficitEndpointUrl = '/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694&sort=-record_date';
export const tickCountXAxis = 5;
export const gap = 2.625;

export const getOpacity = (focusedYear, year) => (focusedYear === year || focusedYear === null ? 1 : 0.5);

export const getMaxTrillions = chartData =>
  chartData?.length ? Math.max(...chartData.map(d => (d[`debt${d.year}`] || 0) + (d[`deficit${d.year}`] || 0))) : 0;

export const getXAxisTicks = maxTrillions => {
  const axisMax = Math.max(40, Math.ceil(maxTrillions / 10) * 10);
  const ticks = [];
  for (let t = 0; t <= axisMax; t += 10) {
    ticks.push(t);
  }
  return ticks;
};
