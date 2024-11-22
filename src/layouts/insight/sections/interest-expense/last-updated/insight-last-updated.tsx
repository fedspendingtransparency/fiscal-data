import React from 'react';

import { lastUpdated } from '../../../insight.module.scss';

export const InsightLastUpdated: ({ lastUpdatedDate }: { lastUpdatedDate?: string }) => React.JSX.Element = ({ lastUpdatedDate }) => {
  return <>{<span className={lastUpdated}>Last Updated: {lastUpdatedDate}</span>}</>;
};
