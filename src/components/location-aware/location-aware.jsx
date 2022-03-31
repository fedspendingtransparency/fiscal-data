import React from 'react';
import { Location } from '@reach/router';

const LocationAware = ComponentToWrap => props => {
  return (
    <Location>
      {({ location }) => {
        return (
          <ComponentToWrap
            {...props}
            location={location}
          />
        );
      }}
    </Location>
  );
};

export default LocationAware;
