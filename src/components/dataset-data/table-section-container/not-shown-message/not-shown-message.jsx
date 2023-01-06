import React from 'react';
import * as styles from './not-shown-message.module.scss';
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const NotShownMessage = ({heading, bodyText}) => {
  return (
    <div className={styles.container} data-testid="container">
      <div className={styles.info}>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </div>
        <div>
          <div className={styles.heading} data-testid="heading">{heading}
          </div>
          <div className={styles.bodyText} data-testid="bodyText">{bodyText}
          </div>
        </div>
      </div>
    </div>
  )
};

export default NotShownMessage;
