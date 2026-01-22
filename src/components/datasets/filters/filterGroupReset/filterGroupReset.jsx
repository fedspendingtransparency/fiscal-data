import React from 'react';
import { filtersByGroupId } from '../../../../transform/filters/filterDefinitions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import { filterReset, icon } from './filterGroupReset.module.scss';

const FilterGroupReset = ({ groupId, activeFilters, onGroupReset, filters }) => {
  const count = filtersByGroupId(groupId, filters).filter(filter => activeFilters.indexOf(filter.id) !== -1).length;

  const handleClick = () => {
    onGroupReset(groupId);
  };

  return (
    <>
      {count > 0 && (
        <button className={filterReset} onClick={handleClick} data-testid={`${groupId}Reset`}>
          <span data-testid="count">{count}</span>
          <FontAwesomeIcon icon={faUndo} className={icon} />
        </button>
      )}
    </>
  );
};

export default FilterGroupReset;
