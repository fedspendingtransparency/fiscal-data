import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandHoldingDollar} from "@fortawesome/free-solid-svg-icons";

import {
    icon,
    iconBackground,
    offsetIcon
  } from "./afg-icon.module.scss";


export default function AfgIcon({
    faIcon,
    backgroundColor    
}) {
    return (
        <div data-testid={'afg-icon'} className={iconBackground} style={{ backgroundColor: backgroundColor + '50' }}>
            <FontAwesomeIcon icon={faIcon} className={icon} />
            <FontAwesomeIcon icon={faIcon}
                className={offsetIcon}
                style={{ color: backgroundColor}}
            />
        </div>
    )
}
