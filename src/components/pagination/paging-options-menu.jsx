import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { pageOptions, perPageLabel } from './pagination-controls.module.scss';

const PagingOptionsMenu = ({ menuProps }) => {
  const { options, selected, updateSelected, label, disabled } = menuProps;

  const [anchorElement, setAnchorElement] = useState(null);
  const [selectedOption, setSelectedOption] = useState(selected);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (label === 'Go to Page' && selected !== selectedOption) {
      setSelectedOption(1);
    }
  }, [selected]);

  useEffect(() => {
    if (!open) return;
    const handleScroll = () => setOpen(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [open]);

  const handleOpen = event => {
    setAnchorElement(event.currentTarget);
    setOpen(true);
  };

  const handleCloseOrChange = value => {
    setOpen(false);
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

  return (
    <div className={pageOptions} data-testid="paginationMenu">
      <span className={perPageLabel}>{label}</span>
      <Button
        aria-label="rows-per-page-menu"
        onClick={handleOpen}
        variant="outlined"
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        disabled={disabled}
      >
        {selectedOption}
      </Button>
      <Menu
        id="rows-per-page"
        anchorEl={anchorElement}
        keepMounted
        disablePortal
        disableScrollLock
        open={open}
        onClose={() => handleCloseOrChange(selectedOption)}
      >
        {renderMenuItems()}
      </Menu>
    </div>
  );
};

export default PagingOptionsMenu;
