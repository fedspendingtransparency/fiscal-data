import React from 'react';
import { chip } from './header-chip.module.scss';

const HeaderChip = ({ text, color }) => {
  return (
    <div className={chip} style={{ backgroundColor: color }}>
      {text}
    </div>
  );
};

export default HeaderChip;
