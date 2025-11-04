import React from 'react';
import { container, description } from './visualization-callout.module.scss';

type CalloutProps = {
  color: string;
  children: string;
  customTopMargin: string;
};

const VisualizationCallout: React.FunctionComponent = ({ color, children, customTopMargin }: CalloutProps) => {
  // plain text class .vis-callout is a handle for styling the container from an external component
  return (
    <aside className={`${container} vis-callout`} style={{ borderColor: color, marginTop: customTopMargin }}>
      <div className={description} data-testid="description">
        {children}
      </div>
    </aside>
  );
};
export default VisualizationCallout;
