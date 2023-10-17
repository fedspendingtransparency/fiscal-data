import React from 'react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div>
        <p>{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{color: entry.stroke }}>
            <span 
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: entry.stroke,
                marginRight: '5px',
              }} 
            />
              {`${entry.name}: $${Math.round(entry.value *100) / 100}T`}
          </p>
        ))}
      </div>
    );
  }
  return null;
 };

 export default CustomTooltip;
