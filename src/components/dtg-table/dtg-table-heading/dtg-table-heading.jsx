import React from 'react';
import { rightAlign } from '../../data-table/data-table-helper';

export default function DtgTableHeading({ columns }) {
    const setStyle = (column) => {
      if (rightAlign(column.type)) {
        const types = ['DATE', 'CURRENCY', 'NUMBER', 'PERCENTAGE'];
        if (types.includes(column.type) || column.type?.includes('CURRENCY')) {
          return {
            width: column.width ? `${column.width}%` : 'auto',
            textAlign: 'right'
          }
        }
      }
      else {
        return {width: column.width ? `${column.width}%` : 'auto'};
      }
    };

    return (
        <thead>
            <tr>
                {columns.map((column, index) => (
                    <th key={index} scope="col"  style={setStyle(column)}>{column.name}</th>
                ))}
            </tr>
        </thead>
    )
}
