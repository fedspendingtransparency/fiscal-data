import React from 'react';

export default function DtgTableHeading({ columns }) {
    const setStyle = (column) => {
      const types = ['DATE', 'CURRENCY', 'CURRENCY3', 'NUMBER', 'PERCENTAGE'];
      if (types.includes(column.type)) {
        return {
          width: column.width ? `${column.width}%` : 'auto',
          textAlign: 'right'
        }
      } else {
        return { width: column.width ? `${column.width}%` : 'auto' };
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
