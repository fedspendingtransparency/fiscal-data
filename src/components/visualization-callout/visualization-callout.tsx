import React from 'react';
import {
  container,
  description
} from './visualization-callout.module.scss';


type CalloutProps = {
  color: string,
  children: string
}

const VisualizationCallout: React.FunctionComponent = ({color, children}: CalloutProps) => {
  // plain text class .vis-callout is a handle for styling the container from an external component
  return (
    <div className={`${container} vis-callout`} style={{borderColor: color}}>
      <div className={description} data-testid="description">
        {children}
      </div>
    </div>
  )
};
export default VisualizationCallout;
