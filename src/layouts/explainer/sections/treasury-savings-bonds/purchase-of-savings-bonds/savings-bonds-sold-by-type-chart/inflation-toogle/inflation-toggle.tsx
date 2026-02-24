import React, { FunctionComponent } from 'react';
import { styled } from '@mui/material/styles';
import { SwitchProps } from '@mui/material/Switch/Switch';
import Switch from '@mui/material/Switch';
import { treasurySavingsBondsExplainerSecondary } from '../../../treasury-savings-bonds.module.scss';

const StyledSwitch = styled((props: SwitchProps) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(() => ({
  width: '44px !important',
  height: '23px !important',
  padding: '0 !important',
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    color: '#fff !important',
    transitionDuration: '300ms',
    '&.Mui-focusVisible': {
      '.MuiSwitch-thumb': {
        border: '2px solid black',
      },
    },
    '&.Mui-checked': {
      transform: 'translateX(21px)',
      color: '#fff !important',
      '& + .MuiSwitch-track': {
        backgroundColor: treasurySavingsBondsExplainerSecondary,
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 16,
    height: 16,
    border: '2px solid #864381 !important',
  },
  '& .MuiSwitch-track': {
    borderRadius: 24 / 2,
    backgroundColor: '#e2bee4',
    opacity: 1,
    position: 'absolute !important',
  },
}));

const InflationToggle: FunctionComponent<{
  onToggle: (isToggled: boolean) => void;
  isInflationAdjusted: boolean;
}> = ({ onToggle, isInflationAdjusted }) => {
  const handleToggle = () => {
    onToggle(!isInflationAdjusted);
  };

  return (
    <StyledSwitch
      data-testid="inflation-check-box"
      checked={isInflationAdjusted}
      onChange={handleToggle}
      slotProps={{
        input: {
          'aria-label': `inflation toggle switch active: ${isInflationAdjusted}`,
        },
      }}
      onKeyDown={e => e.key === 'Enter' && handleToggle()}
      tabIndex={0}
    />
  );
};

export default InflationToggle;
