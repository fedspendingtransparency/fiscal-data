import React from 'react';
// import { Location } from '@gatsbyjs/reach-router';
import { location } from 'gatsby';

const LocationAware = ComponentToWrap => props => {
  return (
    <>
      <ComponentToWrap {...props} location={location} />;
    </>
  );
};

export default LocationAware;
