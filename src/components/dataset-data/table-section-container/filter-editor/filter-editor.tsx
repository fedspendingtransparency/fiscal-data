import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { title, addFilterBtn, icon } from './filter-editor.module.scss';

type EditableFilter = {
  key: string;
  operator: string;
  value: string;
};

type FilterEditorProps = {
  filters: EditableFilter[];
  columnNames: string[];
  onUpdate: (filters: EditableFilter[]) => void;
};

const FilterEditor: FunctionComponent<FilterEditorProps> = ({ filters, columnNames, onUpdate }) => {
  const editableFilters = filters.map(f => Object.assign({}, f));

  const FILTER_OPERATORS = [
    {
      label: 'equals (:eq:)',
      operator: 'eq',
    },
    {
      label: 'greater than (:gt:)',
      operator: 'gt',
    },
    {
      label: 'greater than or equal to (:gte:)',
      operator: 'gte',
    },
    {
      label: 'less than (:lt:)',
      operator: 'lt',
    },
    {
      label: 'less than or equal to (:lte:)',
      operator: 'lte',
    },
    {
      label: 'in list (:in:)',
      operator: 'in',
    },
    {
      label: 'does NOT equal (neq)',
      operator: 'neq',
    },
    {
      label: 'is NOT in list (nin)',
      operator: 'nin',
    },
  ];

  const updateFilter = (event, index) => {
    // using onBlur events for updates to filters because they are accessible friendly
    // in cases where changes are not meant to cascade into immediate outside effects
    if (event && event.target) {
      editableFilters[index][event.target.getAttribute('data-part')] = event.target.value;
      onUpdate(editableFilters);
    }
  };

  const removeFilter = index => {
    editableFilters.splice(index, 1);
    onUpdate(editableFilters);
  };

  const addFilter = () => {
    editableFilters.push({
      key: columnNames[0],
      operator: FILTER_OPERATORS[0].operator,
      value: '',
    });
    onUpdate(editableFilters);
  };

  return (
    <>
      <div>
        <h5 className={title}>
          Filters being applied to this Pivot View:
          <button className={addFilterBtn} onClick={() => addFilter()} data-testid="add-filter">
            <FontAwesomeIcon icon={faPlus} className={icon} />
            Add {filters.length ? 'another' : 'a'} filter
          </button>
        </h5>
      </div>

      {filters.map((filter, idx) => (
        <div key={idx}>
          <select defaultValue={filter.key} data-part="key" onBlur={e => updateFilter(e, idx)} data-testid={`select-key-${idx}`}>
            {columnNames.map((col, ci) => (
              <option value={col} key={ci}>
                {col}
              </option>
            ))}
          </select>
          <select defaultValue={filter.operator} data-part="operator" onBlur={e => updateFilter(e, idx)} data-testid={`select-operator-${idx}`}>
            {FILTER_OPERATORS.map((op, oi) => (
              <option value={op.operator} key={oi}>
                {op.label}
              </option>
            ))}
          </select>
          <input defaultValue={filter.value} size={100} data-part="value" onBlur={e => updateFilter(e, idx)} data-testid={`input-value-${idx}`} />
          <button onClick={() => removeFilter(idx)} data-testid={`remove-row-${idx}`}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ))}
    </>
  );
};

export default FilterEditor;
