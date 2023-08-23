import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Menu, MenuItem } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as styles from './pagination-controls.module.scss';


const PagingOptionsMenu = ({ menuProps }) => {
  const { options, selected, updateSelected, label } = menuProps;

  const [anchorElement, setAnchorElement] = useState(null);
  const [selectedOption, setSelectedOption] = useState(selected);

  useEffect(() => {
    if (label === 'Go to Page' && selected !== selectedOption) {
      setSelectedOption(1);
    };
  }, [selected]);

  const handleOpen = (event) => {
    setAnchorElement(event.currentTarget);
  };

  const handleCloseOrChange = (value) => {
    setAnchorElement(null);
    setSelectedOption(value);
    updateSelected(value);
  };

  const renderMenuItems = () => {
    return options.map((option) => (
      <MenuItem
        key={`${label} - ${option.toString()}`}
        onClick={() => handleCloseOrChange(option)}
      >
        {option.toString()}
      </MenuItem>
      )
    );
  };

  return (
    <div className={styles.pageOptions}>
      <span className={styles.perPageLabel}>{label}</span>
      <Button
        aria-label="rows-per-page-menu"
        onClick={handleOpen}
        variant="outlined"
        endIcon={anchorElement === null ? <ExpandMoreIcon /> : <ExpandLessIcon />}
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
}

export default PagingOptionsMenu;
