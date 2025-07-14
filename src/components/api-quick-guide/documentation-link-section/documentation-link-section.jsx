import React from 'react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import {
  header,
  headerLeft,
  headerText,
  infoIcon as infoIconStyle,
  button,
  footer,
  footerTitle,
  footerList,
  container,
} from './documentation-link-section.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'gatsby';

const useStyles = makeStyles(theme => ({
  iconColor: {
    '& path': {
      fill: '#00a5d4',
    },
  },
}));

const DocumentationLinkSection = ({ type: typeProp }) => {
  const classes = useStyles();
  const infoIcon = <FontAwesomeIcon icon={faInfoCircle} className={`${infoIconStyle} ${classes.iconColor}`} alt="info icon" />;

  const renderContent = () => {
    let html = <></>;
    const type = typeProp ? typeProp.toUpperCase() : 'HEADER';
    if (type === 'HEADER') {
      html = (
        <div className={header} data-testid={'header'}>
          <div className={headerLeft}>
            {infoIcon}
            <div className={headerText}>Check out our more detailed API Documentation.</div>
          </div>
          <Link to="/api-documentation/" className={button} data-testid={'button-link'}>
            API Documentation
          </Link>
        </div>
      );
    } else {
      html = (
        <>
          <div className={footer} data-testid={'footer'}>
            <div>
              {infoIcon}
              <h3 className={footerTitle}>For More API Information</h3>
            </div>
            <div className={footerList}>
              Visit our full API documentation to find out more about:
              <ul>
                <li>Aggregation and sums</li>
                <li>Pivoting</li>
                <li>Response codes</li>
                <li>Meta object</li>
                <li>...and more!</li>
              </ul>
              <Link to="/api-documentation/" className={button} data-testid={'button-link'}>
                API Documentation
              </Link>
            </div>
          </div>
        </>
      );
    }

    return html;
  };

  return <div className={container}>{renderContent()}</div>;
};

export default DocumentationLinkSection;
