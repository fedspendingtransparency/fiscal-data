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
