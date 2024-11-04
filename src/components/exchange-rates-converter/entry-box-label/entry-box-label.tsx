import InfoTip from '../../info-tip/info-tip';
import React, { FocusEventHandler, FunctionComponent, MouseEventHandler, ReactElement } from 'react';
import { labelContainer } from './entry-box-label.module.scss';

interface IEntryBoxLabel {
  label: string;
  tooltipBody?: ReactElement | string;
  dataTestID?: string;
  handleMouseEnter: MouseEventHandler;
  handleTooltipClose: FocusEventHandler;
}

const EntryBoxLabel: FunctionComponent<IEntryBoxLabel> = ({
  label,
  tooltipBody,
  dataTestID,
  handleMouseEnter,
  handleTooltipClose,
}: IEntryBoxLabel) => {
  if (!tooltipBody) {
    return (
      <div className={labelContainer} data-testid={dataTestID}>
        <span>{label}</span>
      </div>
    );
  } else {
    return (
      <div className={labelContainer}>
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
