import InfoTip from '../../info-tip/info-tip';
import React from 'react';

const EntryBoxLabel = ({ label, tooltipBody, dataTestID, handleMouseEnter, handleTooltipClose }) => {
  if (!tooltipBody) {
    return (
      <div style={{ fontSize: '14px', fontWeight: '400' }} data-testid={dataTestID}>
        <span>{label}</span>
      </div>
    );
  } else {
    return (
      <div style={{ fontSize: '14px', fontWeight: '400' }}>
        <span>{label}</span>
        <span data-testid={dataTestID} onMouseEnter={handleMouseEnter} onBlur={handleTooltipClose} role="presentation">
          <InfoTip
            hover
            iconStyle={{
              color: '#666666',
              width: '14px',
              height: '14px',
            }}
            title={label}
          >
            {tooltipBody}
          </InfoTip>
        </span>
      </div>
    );
  }
};

export default EntryBoxLabel;
