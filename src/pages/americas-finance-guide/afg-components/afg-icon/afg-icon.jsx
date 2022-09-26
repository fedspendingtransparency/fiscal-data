import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";

import {
    icon,
    iconBackground,
    offsetIcon
} from "./afg-icon.module.scss";

export default function AfgIcon({
    faIcon,
    iconColor,
    backgroundColor = null

}) {
    const [circleColor, setCircleColor] = useState('');
    useEffect(() => {
        setCircleColor( backgroundColor ? backgroundColor : iconColor + '10')
    }, [])

    return (
        <div data-testid={'afg-icon'} className={iconBackground} style={{ backgroundColor: circleColor }}>
            <FontAwesomeIcon icon={faIcon} className={icon} />
            <FontAwesomeIcon icon={faIcon}
                className={offsetIcon}
                style={{ color: iconColor }}
            />
        </div>
    )
}
