import React, { FunctionComponent } from 'react';
import {
  listContainer,
  title,

} from './glossary-list.module.scss';


const GlossaryList:FunctionComponent = () => {

  return (
    <div className={listContainer}>
      <span className={title}>All Terms </span>
      List Placeholder
    </div>
  )
}

export default GlossaryList;
