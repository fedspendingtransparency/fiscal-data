import React from 'react';
import {container} from './dsm.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import {explainerDataSources} from "../../explainer/sections/sections";
import DataSourcesMethodologies from "../../explainer/data-sources-methodologies/data-sources-methodologies";

const DSM = ({children}) => {
  return (
    <div className={container}>
      <DataSourcesMethodologies pageName={''}>
        {children}
      </DataSourcesMethodologies>
    </div>
  );
}

const ExtIcon = () => {
  return <FontAwesomeIcon data-testid="dsmExtIcon" icon={faExternalLinkAlt} />
}

const dsmComponents = {
  DSM,
  ExtIcon
}

export default dsmComponents ;
