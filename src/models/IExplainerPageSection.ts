import { FunctionComponent } from 'react';
import { ICpiDataMap } from './ICpiDataMap';

export interface IExplainerPageSection {
  index: number;
  id: string;
  title: string;
  component: FunctionComponent<{
    cpiData: {
      cpiDataByYear: ICpiDataMap;
      cpi12MonthPercentChange: ICpiDataMap;
    };
  }>;
}
