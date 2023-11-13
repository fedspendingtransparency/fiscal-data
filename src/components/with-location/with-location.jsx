import React from 'react';
import { Location } from '@gatsbyjs/reach-router';
import queryString from 'query-string';

const withLocation = ComponentToWrap => props => (
  <Location>
    {({ location }) => {
      const params = queryString.parse(location.search);
      const dataParamKey = Object.keys(params).find(key => key.toLocaleLowerCase() === 'data');
      const dataParam = dataParamKey ? params[dataParamKey] : undefined;
      const isPreProd = dataParam && dataParam.toLocaleLowerCase() === 'preprod';
      return <ComponentToWrap {...props} preProd={isPreProd} />;
    }}
  </Location>
);

export default withLocation;
