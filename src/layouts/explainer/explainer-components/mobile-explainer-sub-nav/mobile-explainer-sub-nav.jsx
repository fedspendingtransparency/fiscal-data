import React, { useEffect, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faHouseChimney } from '@fortawesome/free-solid-svg-icons';
import { navigate } from 'gatsby';
import Analytics from '../../../../utils/analytics/analytics';
import {
  activeMenu,
  buttonOverview,
  carrot,
  debt,
  deficit,
  faHouse,
  mainContainer,
  mainContainerHidden,
  mainContainerShow,
  mainContainerSticky,
  mainListSticky,
  MenuList,
  overview,
  overviewStyle,
  revenue,
  spending,
} from './mobile-explainer-sub-nav.module.scss';

const MobileExplainerSubNav = ({ hidePosition, pageName = '' }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [navBlockStyle, setNavBlockStyle] = useState(mainContainerShow);
  const [defaultOpen, setDefaultOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleScroll = () => {
    const prevScrollPosition = scrollPosition;
    const currPosition = window.pageYOffset; //TODO: replace
    setScrollPosition(currPosition);

    if (currPosition > hidePosition) {
      if (prevScrollPosition < currPosition) {
        setNavBlockStyle(mainContainerHidden);
        handleClose();
      } else {
        setNavBlockStyle(mainContainerSticky);
        handleClose();
      }
    } else {
      setNavBlockStyle(mainContainerShow);
      handleClose();
    }
  };

  const analyticsEvent = title => {
    Analytics.event({
      category: 'Explainers',
      action: `Sub Nav Click`,
      label: title,
    });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'Sub Nav Click',
      eventLabel: title,
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);

  const handleClick = event => {
    setDefaultOpen(false);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setDefaultOpen(false);
    setAnchorEl(null);
  };

  const currentPage = name => {
    switch (name) {
      case 'Revenue':
        return pageName.includes('government-revenue');
      case 'Spending':
        return pageName.includes('federal-spending');
      case 'Deficit':
        return pageName.includes('national-deficit');
      case 'Debt':
        return pageName.includes('national-debt');
      default:
        return true;
    }
  };

  const handlePageClick = (name, path) => {
    analyticsEvent(name);
    navigate(path);
  };

  return (
    <div className={`${currentPage('Overview') ? [mainContainer, overview].join(' ') : mainContainer}`} data-testid="mobileSubNav">
      <nav className={navBlockStyle} data-testid="mobileSubNavBlock">
        <button
          aria-controls="customized-menu"
          aria-haspopup="true"
          color="#0a2f5a"
          onClick={handleClick}
          onKeyDown={handleClick}
          className={`${currentPage('Overview') ? [buttonOverview, activeMenu].join(' ') : buttonOverview}`}
          data-testid="mobileSubNavBlockButton"
        >
          <span
            onClick={() => handlePageClick('Overview', '/americas-finance-guide/')}
            onKeyDown={() => handlePageClick('Overview', '/americas-finance-guide/')}
            className={overviewStyle}
            id="home"
            role="button"
            tabIndex={0}
            data-testid="afgSpan"
          >
            <FontAwesomeIcon className={faHouse} icon={faHouseChimney} />
            Overview
          </span>
          <FontAwesomeIcon className={carrot} icon={anchorEl ? faCaretDown : faCaretRight} />
        </button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          disableScrollLock={true}
          open={defaultOpen || Boolean(anchorEl)}
          onClose={handleClose}
          sx={{ opacity: Boolean(anchorEl) ? 1 : 0 }}
          className={mainListSticky}
          id="styled-menu"
          elevation={0}
          // getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem className={MenuList}>
            <ListItemText
              className={`${currentPage('Revenue') ? [revenue, activeMenu].join(' ') : revenue}`}
              onClick={() => handlePageClick('Revenue', '/americas-finance-guide/government-revenue/')}
              onKeyDown={() => handlePageClick('Revenue', '/americas-finance-guide/government-revenue/')}
              primary="Revenue"
              data-testid="revenueButton"
            />
          </MenuItem>
          <MenuItem className={MenuList}>
            <ListItemText
              className={`${currentPage('Spending') ? [spending, activeMenu].join(' ') : spending}`}
              onClick={() => handlePageClick('Spending', '/americas-finance-guide/federal-spending/')}
              onKeyDown={() => handlePageClick('Spending', '/americas-finance-guide/federal-spending/')}
              primary="Spending"
              data-testid="spendingButton"
            />
          </MenuItem>
          <MenuItem className={MenuList}>
            <ListItemText
              className={`${currentPage('Deficit') ? [deficit, activeMenu].join(' ') : deficit}`}
              onClick={() => handlePageClick('Deficit', '/americas-finance-guide/national-deficit/')}
              onKeyDown={() => handlePageClick('Deficit', '/americas-finance-guide/national-deficit/')}
              primary="Deficit"
              data-testid="deficitButton"
            />
          </MenuItem>
          <MenuItem className={MenuList}>
            <ListItemText
              className={`${currentPage('Debt') ? [debt, activeMenu].join(' ') : debt}`}
              onClick={() => handlePageClick('Debt', '/americas-finance-guide/national-debt/')}
              onKeyDown={() => handlePageClick('Debt', '/americas-finance-guide/national-debt/')}
              primary="Debt"
              data-testid="debtButton"
            />
          </MenuItem>
        </Menu>
      </nav>
    </div>
  );
};

export default MobileExplainerSubNav;
