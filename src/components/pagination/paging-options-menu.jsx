import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Menu, MenuItem } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { pageOptions, perPageLabel } from './pagination-controls.module.scss';

const PagingOptionsMenu = ({ menuProps }) => {
  const { options, selected, updateSelected, label, disabled } = menuProps;

  const [anchorElement, setAnchorElement] = useState(null);
  const [selectedOption, setSelectedOption] = useState(selected);

  useEffect(() => {
    if (label === 'Go to Page' && selected !== selectedOption) {
      setSelectedOption(1);
    }
  }, [selected]);

  const handleOpen = event => {
    setAnchorElement(event.currentTarget);
  };

  const handleCloseOrChange = value => {
    setAnchorElement(null);
    setSelectedOption(value);
    if (updateSelected) {
      updateSelected(value);
    }
  };

  const renderMenuItems = () => {
    return options.map(option => (
      <MenuItem key={`${label} - ${option.toString()}`} onClick={() => handleCloseOrChange(option)}>
        {option.toString()}
      </MenuItem>
    ));
  };

  //Todo: button turns blue on click

  return (
    <div className={pageOptions} data-testid="paginationMenu">
      <span className={perPageLabel}>{label}</span>
      <Button
        aria-label="rows-per-page-menu"
        onClick={handleOpen}
        variant="outlined"
        endIcon={anchorElement === null ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        disabled={disabled}
        sx={{ borderColor: 'rgba(0, 0, 0, 0.23)', fontWeight: '400' }}
      >
        {selectedOption}
      </Button>
      <Menu
        id="rows-per-page"
        anchorEl={anchorElement}
        keepMounted
        disablePortal
        open={Boolean(anchorElement)}
        onClose={() => handleCloseOrChange(selectedOption)}
      >
        {renderMenuItems()}
      </Menu>
    </div>
  );
};

export default PagingOptionsMenu;
