import React, { ReactElement } from 'react';
import {container} from './dsm.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import DataSourcesMethodologies from "../../explainer/data-sources-methodologies/data-sources-methodologies";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const DSM = (children: ReactElement): ReactElement => {
  return (
    <div className={container}>
      <DataSourcesMethodologies pageName={''}>
        {children}
      </DataSourcesMethodologies>
    </div>
  );
}

const ExtIcon = (): ReactElement => {
  return <FontAwesomeIcon data-testid="dsmExtIcon" icon={faExternalLinkAlt as IconProp} />
}

const dsmComponents = {
  DSM,
  ExtIcon
}

export default dsmComponents ;
