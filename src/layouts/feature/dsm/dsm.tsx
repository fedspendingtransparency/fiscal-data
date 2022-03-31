import React from 'react';
import {container} from './dsm.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

const DSM = ({children}) => {
  return <div className={container}>{children}</div>
}

const ExtIcon = () => {
  return <FontAwesomeIcon data-testid="dsmExtIcon" icon={faExternalLinkAlt} />
}

const dsmComponents = {
  DSM,
  ExtIcon
}

export default dsmComponents ;
