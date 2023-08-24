import React, {useState, useEffect} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouseChimney} from "@fortawesome/free-solid-svg-icons";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {faCaretRight} from "@fortawesome/free-solid-svg-icons";
import {navigate} from 'gatsby';
import Analytics from "../../../../utils/analytics/analytics";
import {
  MenuList,
  buttonOverview,
  spending,
  revenue,
  deficit,
  debt,
  carrot,
  faHouse,
  stylingStyledMenu,
  overviewStyle,
  mainContainer,
  mainContainerSticky,
  mainContainerHidden,
  mainContainerShow,
  activeMenu,
  mainListSticky
} from "./mobile-explainer-sub-nav.module.scss";

const StyledMenu = withStyles({
  paper: {
    width: "288px",
    backgroundColor: "transparent",
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(() => ({
  root: {
    "&:focus": {
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {},
    },
  },
}))(MenuItem);

export default function MobileExplainerSubNav({ hidePosition, pageName = ''}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [navBlockStyle, setNavBlockStyle] = useState(mainContainerShow);
  const [isRevenue, setIsRevenue] = useState(false);
  const [isSpending, setIsSpending] = useState(false);
  const [isDeficit, setIsDeficit] = useState(false);
  const [isDebt, setIsDebt] = useState(false);
  const [isOverview, setIsOverview] = useState(false);
  const [defaultOpen, setDefaultOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleScroll = () => {
    const prevScrollPosition = scrollPosition
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

  const analyticsEvent = (title) => {
    Analytics.event({
      category: 'Explainers',
      action: `Sub Nav Click`,
      label: title
    });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'Sub Nav Click',
      'eventLabel': title,
    });
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
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

  useEffect(() => {
    if (pageName.includes('government-revenue')) {
      setIsRevenue(true);
    } else if (pageName.includes('federal-spending')) {
      setIsSpending(true);
    } else if (pageName.includes('national-deficit')) {
      setIsDeficit(true);
    } else if (pageName.includes('national-debt')) {
      setIsDebt(true);
    } else {
      setIsOverview(true);
    }
  }, []);

  return (
    <div className={mainContainer} data-testid="mobileSubNav">
      <div className={navBlockStyle} data-testid="mobileSubNavBlock">
        <button
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained" //TODO: Look into warning around this
          color="#0a2f5a"
          onClick={handleClick}
          onKeyPress={handleClick}
          className={`${isOverview ? [buttonOverview, activeMenu].join(" ") : buttonOverview}`}
          data-testid="mobileSubNavBlockButton"
        >
          <span
            onClick={() => {
              analyticsEvent('Overview');
              navigate('/americas-finance-guide/');
            }}
            onKeyPress={() => {
              analyticsEvent('Overview');
              navigate('/americas-finance-guide/');
            }}
            className={overviewStyle} id="home"
            role={'button'}
            tabIndex={0}
            data-testid="afgSpan"
          >
            <FontAwesomeIcon className={faHouse} icon={faHouseChimney} />
            Overview
          </span>
          <FontAwesomeIcon className={carrot} icon={anchorEl ? faCaretDown: faCaretRight} />
        </button>
        <StyledMenu
          anchorEl={anchorEl}
          keepMounted
          disableScrollLock={true}
          open={defaultOpen || Boolean(anchorEl)}
          onClose={handleClose}
          className={[mainListSticky, stylingStyledMenu].join(" ")}
          id="styled-menu"
        >
          <StyledMenuItem className={MenuList}>
            <ListItemText
              className={`${isRevenue ? [revenue, activeMenu].join(" ") : revenue}`}
              onClick={() => {
                analyticsEvent('Revenue');
                navigate("/americas-finance-guide/government-revenue/");
              }}
              primary="Revenue"
              data-testid="revenueButton"
            />
          </StyledMenuItem>
          <StyledMenuItem className={MenuList}>
            <ListItemText
              className={`${isSpending ? [spending, activeMenu].join(" ") : spending}`}
              onClick={() => {
                analyticsEvent('Spending');
                navigate("/americas-finance-guide/federal-spending/");
              }}
              primary="Spending"
              data-testid="spendingButton"
            />
          </StyledMenuItem>
          <StyledMenuItem className={MenuList}>
            <ListItemText
              className={`${isDeficit ? [deficit, activeMenu].join(" ") : deficit}`}
              onClick={() => {
                analyticsEvent('Deficit');
                navigate("/americas-finance-guide/national-deficit/");
              }}
              primary="Deficit"
              data-testid="deficitButton"
            />
          </StyledMenuItem>
          <StyledMenuItem className={MenuList}>
            <ListItemText
              className={`${isDebt ? [debt, activeMenu].join(" ") : debt}`}
              onClick={() => {
                analyticsEvent('Debt');
                navigate("/americas-finance-guide/national-debt/");
              }}
              primary="Debt"
              data-testid="debtButton"
            />
          </StyledMenuItem>
        </StyledMenu>
      </div>
    </div>
  );
}
