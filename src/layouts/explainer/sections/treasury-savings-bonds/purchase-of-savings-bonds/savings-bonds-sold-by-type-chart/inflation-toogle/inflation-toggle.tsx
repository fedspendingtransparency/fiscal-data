import React, { FunctionComponent, useState } from 'react';
import { styled } from '@mui/material/styles';
import { SwitchProps } from '@mui/material';
import Switch from '@mui/material/Switch';
import { treasurySavingsBondsExplainerSecondary } from '../../../treasury-savings-bonds.module.scss';

const InflationToggle: FunctionComponent = () => {
  const [inflationSwitch, setInflationSwitch] = useState(false);
  const StyledSwitch = styled((props: SwitchProps) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(() => ({
    width: 45,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(21px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: treasurySavingsBondsExplainerSecondary,
          opacity: 1,
          border: 0,
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 20,
      height: 20,
      border: '2px solid #864381',
    },
    '& .MuiSwitch-track': {
      borderRadius: 24 / 2,
      backgroundColor: '#e2bee4',
      opacity: 1,
    },
  }));
  return (
    <StyledSwitch
      checked={inflationSwitch}
      onChange={() => setInflationSwitch(!inflationSwitch)}
      onKeyDown={e => e.key === 'Enter' && setInflationSwitch(!inflationSwitch)}
      tabIndex={0}
    />
  );
};

export default InflationToggle;